import type {
  WP_REST_API_Attachment,
  WP_REST_API_Category,
  WP_REST_API_Page,
  WP_REST_API_Post,
} from "deco-sites/ultimato/cms/wordpress/types/wp-types.ts";

import type {
  NavMenu,
  NavMenuItem,
} from "deco-sites/ultimato/loaders/menus.ts";

import type {
  BlogPost as _BlogPost,
  Category as _Category,
} from "apps/blog/types.ts";

import { filterCategories } from "deco-sites/ultimato/utils/categories.tsx";
import {
  isExternalURL,
  replaceAllSites,
} from "deco-sites/ultimato/utils/url.ts";

import {
  formatContent,
  formatDate,
  formatExcerpt,
  formatTitle,
  getReadingTime,
} from "deco-sites/ultimato/utils/content.tsx";

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export interface BlogPost
  extends Omit<_BlogPost, "image" | "authors" | "categories"> {
  id: number;
  image?: Media;
  readingTime?: number;
  categories?: Category[];
  views: number;
  acf?: Record<string, unknown>;
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
  acf?: Record<string, unknown>;
}

export interface DecoMenuItem extends Omit<NavMenuItem, "title"> {
  title: string;
  children?: DecoMenuItem[];
}

export interface DecoMenu extends Omit<NavMenu, "items"> {
  items: DecoMenuItem[];
}

export const toBlogPost = (
  post: AtLeast<
    WP_REST_API_Post,
    "id" | "title" | "excerpt" | "slug"
  >,
  categories: Category[],
  featuredImages: Media[],
): BlogPost => {
  const featuredImage = featuredImages.find((image) =>
    image.id === post.featured_media
  );

  const postCategories = post?.categories?.map((categoryId) =>
    categories.find((category) => category.id === categoryId)
  );
  const postCategoriesObj = postCategories
    ? (postCategories?.filter(Boolean) as Category[])
      .filter(({ slug }) => filterCategories(slug))
    : [];

  const blogPost: BlogPost = {
    id: post.id,
    title: formatTitle(post.title.rendered),
    excerpt: formatExcerpt(post.excerpt.rendered, 200),
    image: featuredImage,
    categories: postCategoriesObj ?? [],
    date: post.date ? formatDate(post.date) : "",
    slug: post.slug,
    readingTime: post?.content?.rendered
      ? getReadingTime(post.content.rendered)
      : 0,
    content: post?.content?.rendered
      ? formatContent(post?.content.rendered)
      : "",
    views: parseInt(post.acf?.postViews as string),
    acf: post.acf,
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
    title: formatTitle(page.title.rendered),
    content: formatContent(page.content.rendered),
    acf: page.acf,
  };
};

export const toMenu = (menu: NavMenu): DecoMenu => {
  const menuItems = menu.items;

  // iterate over all items

  const items = menuItems.map((item) => {
    const { id, url, title, target, classes, attr_title, menus, parent } = item;

    const formattedURL = isExternalURL(url) ? url : `${replaceAllSites(url)}`;

    return {
      id,
      url: formattedURL,
      title: title.rendered,
      target,
      classes,
      attr_title,
      menus,
      parent,
    };
  });

  const itemMap = new Map<number, DecoMenuItem>();
  items.forEach((item) => itemMap.set(item.id, { ...item, children: [] }));

  const result: DecoMenuItem[] = [];

  items.forEach((item) => {
    const currentItem = itemMap.get(item.id) as DecoMenuItem;

    if (item.parent === 0) {
      result.push(currentItem);
    } else {
      const parent = itemMap.get(item.parent);
      if (parent) {
        parent.children?.push(currentItem);
      }
    }
  });

  return {
    id: menu.id,
    items: result,
  };
};

export const formatQuery = (
  input: Record<string, string | undefined | null>,
) => {
  const cleanup = Object.fromEntries(
    Object.entries(input)
      .filter(([_, value]) =>
        value !== undefined && value !== "" && value !== null
      )
      .map(([key, value]) => [key, value as string]),
  ) as { [k: string]: string };

  if (cleanup.include && cleanup.slug) {
    delete cleanup.slug;
  }

  return cleanup;
};
