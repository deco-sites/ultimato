import { fetchUB as fetch } from "deco-sites/ultimato/cms/wordpress/client.ts";
import { toBlogPost } from "deco-sites/ultimato/utils/transform.ts";

import type { Status } from "std/http/mod.ts";

//import { STALE } from "apps/utils/fetch.ts";

import { AppContext } from "../apps/site.ts";

import type {
  DecoPostArchive,
} from "deco-sites/ultimato/loaders/post-archive.ts";

/**
 * @title WordPress Most Read Posts
 */
const loader = async (
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<DecoPostArchive> => {
  const postsPath = `/most-read`;
  const postList = await fetch.ub<{
    id: number;
    title: {
      rendered: string;
    };
    image: string;
    slug: string;
    excerpt: {
      rendered: string;
      protected: false;
    };
    views: number;
  }[]>(postsPath, {});

  console.log("\n\n");
  console.log("%cLoader: Most Read", "color: blue;");
  console.log("Path: ", postsPath);
  console.log("Post IDs: ", postList.content.map(({ id }) => id));
  console.log("\n\n");

  const normalizedPosts = postList.content.map((post) => {
    return toBlogPost(
      post,
      [],
      [],
    );
  });

  return {
    posts: normalizedPosts,
    pageContext: {
      page: 1,
      perPage: 10,
      totalPosts: 10,
      totalPages: 1,
      status: ctx.response.status as Status,
    },
  };
};

export const cache = "stale-while-revalidate";

export const cacheKey = (_props: unknown, _req: Request, _ctx: AppContext) =>
  `most-read-${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

export default loader;
