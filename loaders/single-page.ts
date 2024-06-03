import { type Page } from "deco-sites/ultimato/utils/transform.ts";

import { AppContext } from "../apps/site.ts";

export interface DecoSinglePage {
  contentTypeName?: string;
  page?: Page;
}

export interface Props {
  id: number;
}

const loader = async (
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<DecoSinglePage> => {
  const variables = {
    slug: new URL(req.url).pathname.slice(1).split("/")[0],
  };

  const getPage = await ctx.invoke(
    "deco-sites/ultimato/loaders/page-archive.ts",
    {
      slug: [variables.slug],
    },
  );

  if (!getPage) {
    ctx.response.status = 404;
    return {
      contentTypeName: "page",
      page: undefined,
    };
  }

  return {
    contentTypeName: "page",
    page: getPage.page[0],
  };
};

export default loader;
