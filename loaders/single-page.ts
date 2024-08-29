import { type Page } from "deco-sites/ultimato/utils/transform.ts";

import { AppContext } from "../apps/site.ts";

import type { Status } from "std/http/mod.ts";

import type { Props as PageProps } from "deco-sites/ultimato/loaders/page-archive.ts";

export interface DecoSinglePage {
  contentTypeName?: string;
  page?: Page;
  status: Status;
}
export interface Props {
  /** @description Slug da página. */
  slug?: string;

  /** @description ID da página. */
  id?: number;
}

const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<DecoSinglePage> => {
  const variables: PageProps = {
    slug: props.slug
      ? [props.slug]
      : [new URL(req.url).pathname.slice(1).split("/")[0] as string],
    include: props.id ? [props.id] : undefined,
    perPage: 1,
  };

  if (variables.include && variables.slug) {
    delete variables.slug;
  }

  const getPage = await ctx.invoke(
    "deco-sites/ultimato/loaders/page-archive.ts",
    variables,
  );

  if (!getPage) {
    ctx.response.status = 404;
    return {
      contentTypeName: "page",
      page: undefined,
      status: ctx.response.status as Status,
    };
  }

  return {
    contentTypeName: "page",
    page: getPage.page[0],
    status: ctx.response.status as Status,
  };
};

export default loader;
