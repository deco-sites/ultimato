import { fetchUB as fetch } from "deco-sites/ultimato/cms/wordpress/client.ts";
import { type Page, toPage } from "deco-sites/ultimato/utils/transform.ts";

//import { STALE } from "apps/utils/fetch.ts";

import type {
  WP_REST_API_Pages,
} from "deco-sites/ultimato/cms/wordpress/types/wp-types.ts";

import { AppContext } from "../apps/site.ts";

export interface Props {
  /** @description Página atual da coleção. */
  page?: number;

  /** @description Número de posts por página. */
  perPage?: number;

  /** @description Limitar resultados para aqueles que combinam com um texto. */
  search?: string;

  /** @description Garantir que o resultado exclua IDs específicos.  */
  exclude?: number[];

  /** @description Limitar resultados para IDs específicos.   */
  include?: number[];

  /** @description Limitar respostas a posts publicados depois de uma determinada data */
  /** @format date */
  after?: string;

  /** @description Limitar resultados a posts atribuídos a autores específicos. */
  author?: number[];

  /** Garantir que o resultado exclui posts atribuídos a autores específicos. */
  authorExclude?: number[];

  /** @description Limitar respostas a posts publicados antes de uma determinada data */
  /** @format date */
  before?: string;

  /** @description Deslocar o resultado para um número especifico de itens. */
  offset?: number;

  /** @description Ordenar atributos de forma ascendente ou descendente. */
  order?: "asc" | "desc";

  /** @description Ordenar coleção pelo atributo do post. */
  orderBy?:
    | "author"
    | "date"
    | "id"
    | "include"
    | "modified"
    | "parent"
    | "relevance"
    | "slug"
    | "title";

  /** @description Limitar resultados de posts definidos por um ou mais slugs específicos. */
  slug?: string[];

  /** @description Limitar resultados de posts atribuído por um ou mais status. */
  status?: "publish" | "future" | "draft" | "pending" | "private";

  /** @description Limitar resultados a posts atribuídos a categorias específicas. */
  categories?: string;

  /** @description Limitar resultados a posts atribuídos a tags específicas. */
  tags?: string;

  /** @description Limitar resultados para todos os itens que tenham o termo específico atribuído para a taxonomia categories. */
  categoriesExclude?: string;

  /** @description Limitar resultados para todos os itens que tenham o termo específico atribuído para a taxonomia tags. */
  tagsExclude?: string;
}

export interface DecoPageArchive {
  page: Page[];
  pageContext: {
    page: number;
    perPage: number;
    totalPosts: number;
    totalPages: number;
  };
}

/**
 * @title WordPress Post Archive Loader
 */
const loader = async (
  {
    page = 1,
    perPage = 10,
    search,
    exclude,
    include,
    after,
    author,
    authorExclude,
    before,
    offset,
    order = "desc",
    orderBy = "date",
    slug,
    status = "publish",
    categories,
    tags,
    categoriesExclude,
    tagsExclude,
  }: Props,
  _req: Request,
  ctx: AppContext,
): Promise<DecoPageArchive> => {
  //assign the variables to the query if they are not undefined
  const input = {
    page: page.toString(),
    per_page: perPage.toString(),
    search,
    exclude: exclude?.join(","),
    include: include?.join(","),
    after: after ? new Date(after).toISOString() : null,
    author: author?.join(","), //join the array of authors into a string
    author_exclude: authorExclude?.join(","), //join the array of authors into a string
    before: before ? new Date(before).toISOString() : null,
    offset: offset?.toString(),
    order,
    orderby: orderBy,
    slug: slug?.join(","), //join the array of slugs into a string
    status,
    categories,
    tags,
    categories_exclude: categoriesExclude,
    tags_exclude: tagsExclude,
  };

  const variables = Object.fromEntries(
    Object.entries(input)
      .filter(([_, value]) =>
        value !== undefined && value !== "" && value !== null
      )
      .map(([key, value]) => [key, value as string]),
  ) as { [k: string]: string };

  const postsPath = `/pages?${new URLSearchParams(variables)}`;
  const postList = await fetch.wp<WP_REST_API_Pages>(postsPath, {});

  console.log("\n\n");
  console.log("%cLoader: Page Archive", "color: blue;");
  console.log("Path: ", postsPath);
  console.table(variables);
  console.log("Post IDs: ", postList.content.map(({ id }) => id));
  console.log("\n\n");

  const featuredImageIds = postList.content.map(({ featured_media }) =>
    featured_media
  ).join(",");

  const featuredImages = await ctx.invoke(
    "deco-sites/ultimato/loaders/media.ts",
    {
      include: featuredImageIds.split(",").map(Number),
      perPage: 99,
    },
  );

  const normalizedPosts = postList.content.map((page) => {
    return toPage(
      page,
      featuredImages.mediaItens,
    );
  });

  const totalPosts = postList.headers.get("X-WP-Total") as unknown as number;
  const totalPages = postList.headers.get(
    "X-WP-TotalPages",
  ) as unknown as number;

  return {
    page: normalizedPosts,
    pageContext: {
      page,
      perPage,
      totalPosts,
      totalPages,
    },
  };
};

export const cache = "stale-while-revalidate";

export const cacheKey = (props: Props, req: Request, _ctx: AppContext) => {
  const url = new URL(req.url);
  return url.href + btoa(JSON.stringify(props));
};

export default loader;
