import {
  type BlogPost,
  type Page,
} from "deco-sites/ultimato/utils/transform.ts";

import type { Status } from "std/http/mod.ts";

import { AppContext } from "../apps/site.ts";
export interface DecoSinglePost {
  contentTypeName?: string;
  singlePost?: BlogPost;
  relatedPosts?: BlogPost[];
  page?: Page;
  status: Status;
}

import type { Props as PostProps } from "deco-sites/ultimato/loaders/post-archive.ts";

export interface Props {
  /** @description Slug do post. */
  slug?: string;

  /** @description ID do post. */
  id?: number;
}

const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<DecoSinglePost> => {
  const variables: PostProps = {
    slug: props.slug
      ? [props.slug]
      : [new URL(req.url).pathname.slice(1).split("/")[0] as string],
    include: props.id ? [props.id] : undefined,
    perPage: 1,
  };

  const getPosts = await ctx.invoke(
    "deco-sites/ultimato/loaders/post-archive.ts",
    variables,
  );

  if (!getPosts.posts.length || getPosts.posts.length === 0) {
    const page = await ctx.invoke("deco-sites/ultimato/loaders/single-page.ts");

    if (page.status === 404) {
      ctx.response.status = 404;
    }

    return {
      contentTypeName: "page",
      page: page.page,
      status: ctx.response.status as Status,
    };
  }

  const categories = getPosts.posts[0].categories?.map((category) =>
    category.id
  ).join(",");

  const relatedPosts = await ctx.invoke(
    "deco-sites/ultimato/loaders/post-archive.ts",
    {
      categories: categories,
      perPage: 3,
    },
  );

  const seo = await ctx.invoke("deco-sites/ultimato/loaders/seo.ts", {
    path: `/${getPosts.posts[0].slug}`,
  });

  getPosts.posts[0].seo = seo;

  return {
    contentTypeName: "post",
    singlePost: getPosts.posts[0],
    relatedPosts: relatedPosts.posts,
    status: ctx.response.status as Status,
  };
};

export default loader;
