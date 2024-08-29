import { formatQuery } from "deco-sites/ultimato/utils/transform.ts";

//import { STALE } from "apps/utils/fetch.ts";

import { AppContext } from "../apps/site.ts";

import type {
  DecoPostArchive,
  Query,
} from "deco-sites/ultimato/loaders/post-archive.ts";

export interface Props {
  /**
   * @description Número de posts por página.
   */
  perPage?: number;

  /**
   * @description Categorias a serem incluídas.
   */
  categories?: string;

  /**
   * @description Usar path da URL para determinar a categoria.
   * @default false
   */
  usePath?: boolean;
}

/**
 * @title WordPress Most Read Posts
 */
const loader = async (
  {
    perPage = 5,
    categories = "",
    usePath = false,
  }: Props,
  req: Request,
  ctx: AppContext,
): Promise<DecoPostArchive> => {
  const input = {
    per_page: perPage.toString(),
    orderBy: "date", //TODO: order by PostViews
    categories,
  };

  const isCategory = req.url.includes("categoria/");
  const isHQ = req.url.includes("hqs/");

  const query: Query = {};
  query.isHQ = isHQ;
  query.isCategory = isCategory;

  const variables = formatQuery(input);

  console.log("\n\n");
  console.log("%cLoader: Most Read", "color: blue;");

  const postList = await ctx.invoke(
    "deco-sites/ultimato/loaders/post-archive.ts",
    {
      ...variables,
      usePath,
    },
  );

  return postList;
};

export const cache = "stale-while-revalidate";

export const cacheKey = (_props: unknown, _req: Request, _ctx: AppContext) =>
  `most-read-${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

export default loader;
