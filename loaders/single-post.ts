import {
  type BlogPost,
  type Page,
} from "deco-sites/ultimato/utils/transform.ts";

import { AppContext } from "../apps/site.ts";
export interface DecoSinglePost {
  contentTypeName?: string;
  singlePost?: BlogPost;
  relatedPosts?: BlogPost[];
  page?: Page;
}

const loader = async (
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<DecoSinglePost> => {
  const variables = {
    slug: new URL(req.url).pathname.slice(1).split("/")[0],
  };

  const getPosts = await ctx.invoke(
    "deco-sites/ultimato/loaders/post-archive.ts",
    {
      slug: [variables.slug],
    },
  );

  console.log(getPosts);

  if (getPosts.posts.length === 0) {
    const page = await ctx.invoke("deco-sites/ultimato/loaders/single-page.ts");

    return {
      contentTypeName: "page",
      page: page.page,
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

  return {
    contentTypeName: "post",
    singlePost: getPosts.posts[0],
    relatedPosts: relatedPosts.posts,
  };
};

export default loader;
