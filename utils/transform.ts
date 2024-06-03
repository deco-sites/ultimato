import type {
  WP_REST_API_Attachment,
  WP_REST_API_Category,
  WP_REST_API_Page,
  WP_REST_API_Post,
} from "deco-sites/ultimato/cms/wordpress/types/wp-types.ts";

import type {
  BlogPost as _BlogPost,
  Category as _Category,
} from "apps/blog/types.ts";

import { filterCategories } from "deco-sites/ultimato/utils/categories.tsx";

import {
  formatContent,
  formatDate,
  formatExcerpt,
  getReadingTime,
  stripTags,
} from "deco-sites/ultimato/utils/content.tsx";

export interface BlogPost
  extends Omit<_BlogPost, "image" | "authors" | "categories"> {
  id: number;
  image?: Media;
  readingTime?: number;
  categories?: Category[];
  views?: number;
}

export interface Category extends _Category {
  id: number;
}

export interface Media {
  id: number;
  url: string;
  alt: string;
}

export interface Page {
  id: number;
  title: string;
  content: string;
  image?: Media;
}

export const toBlogPost = (
  post: WP_REST_API_Post,
  categories: Category[],
  featuredImages: Media[],
): BlogPost => {
  const featuredImage = featuredImages.find((image) =>
    image.id === post.featured_media
  );

  const postCategories = post?.categories?.map((categoryId) =>
    categories.find((category) => category.id === categoryId)
  );
  const postCategoriesObj = (postCategories?.filter(Boolean) as Category[])
    .filter(({ slug }) => filterCategories(slug));

  const blogPost: BlogPost = {
    id: post.id,
    title: stripTags(post.title.rendered),
    excerpt: formatExcerpt(post.excerpt.rendered, 200),
    image: featuredImage,
    categories: postCategoriesObj ?? [],
    date: formatDate(post.date),
    slug: post.slug,
    readingTime: getReadingTime(post.content.rendered),
    content: formatContent(post.content.rendered),
    views: parseInt(post.acf?.postViews as string),
  };

  return blogPost;
};

export const toCategory = (category: WP_REST_API_Category): Category => {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
};

export const toMedia = (media: WP_REST_API_Attachment): Media => {
  return {
    id: media.id,
    url: media.source_url,
    alt: media.alt_text,
  };
};

export const toPage = (
  page: WP_REST_API_Page,
  featuredImages: Media[],
): Page => {
  const featuredImage = featuredImages.find((image) =>
    image.id === page.featured_media
  );

  return {
    id: page.id,
    image: featuredImage,
    title: stripTags(page.title.rendered),
    content: formatContent(page.content.rendered),
  };
};
