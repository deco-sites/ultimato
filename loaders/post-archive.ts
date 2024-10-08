import { fetchUB as fetch } from "deco-sites/ultimato/cms/wordpress/client.ts";

// import { STALE } from "apps/utils/fetch.ts";

import {
  type BlogPost,
  formatQuery,
  toBlogPost,
} from "deco-sites/ultimato/utils/transform.ts";

import type { Status } from "std/http/mod.ts";

//import { STALE } from "apps/utils/fetch.ts";

import type {
  WP_REST_API_Posts,
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
    | "title"
    | "postViews";

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

  /**
   *  @description Utilizar path da URL na query
   *  @default true
   */
  usePath?: boolean;
}

export interface Query {
  categoryName?: string;
  categorySlug?: string;
  isCategory?: boolean;
  isHome?: boolean;
  isHQ?: boolean;
}

export interface DecoPostArchive {
  posts: BlogPost[];
  pageContext: {
    page: number;
    perPage: number;
    totalPosts: number;
    totalPages: number;
    status: Status;
    paginationPrefix: string;
  };
  query: Query;
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
    usePath = true,
  }: Props,
  req: Request,
  ctx: AppContext,
): Promise<DecoPostArchive> => {
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

  const variables = formatQuery(input);

  // page url arguments
  const isPaginated = req.url.includes("page/");
  const isCategory = req.url.includes("categoria/");
  const isHQ = req.url.includes("hqs/");

  const query: Query = {};
  query.isHQ = isHQ;
  query.isCategory = isCategory;

  let paginationPrefix = "/";

  if (isPaginated) {
    const page = req.url.split("page/")[1].split("/")[0];
    variables.page = page;
  }

  if ((isCategory || isHQ) && !variables.include && usePath === true) {
    //path only without query params
    const urlPath = new URL(req.url).pathname;

    const cat = isCategory
      ? urlPath.split("categoria/")[1].split("/")[0]
      : urlPath.split("hqs/")[1].split("/")[0];

    const categories = await ctx.invoke(
      "deco-sites/ultimato/loaders/categories.ts",
      {
        slug: [cat],
      },
    );

    query.categorySlug = cat;

    if (categories.categories.length) {
      variables.categories = categories.categories[0].id.toString();

      query.categoryName = categories.categories[0].name;

      paginationPrefix = isCategory ? `/categoria/${cat}` : `/hqs/${cat}`;
    } else {
      ctx.response.status = 404;
    }
  }

  const postsPath = `/posts?${new URLSearchParams(variables)}`;

  console.log("\n\n");
  console.log("%cLoader: Post Archive", "color: blue;");
  console.log("Path: ", postsPath);
  console.table(variables);

  const postList = await fetch.wp<WP_REST_API_Posts>(postsPath, {} /* STALE */);

  console.log("Post IDs: ", postList.content.map(({ id }) => id));
  console.log("\n\n");

  const categoryIds = postList.content.map(({ categories }) => categories).flat(
    1,
  ).map((id) => id).filter(Boolean) as number[];
  // remove repeated ids
  const categoryUniqueIds = [...new Set(categoryIds)];

  const categoriesPosts = await ctx.invoke(
    "deco-sites/ultimato/loaders/categories.ts",
    {
      include: categoryUniqueIds,
      perPage: 99,
    },
  );

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

  const normalizedPosts = postList.content.map((post) => {
    return toBlogPost(
      post,
      categoriesPosts.categories,
      featuredImages.mediaItens,
    );
  });

  const totalPosts = postList.headers.get("X-WP-Total") as string;
  const totalPages = postList.headers.get(
    "X-WP-TotalPages",
  ) as string;

  if (new URL(req.url).pathname === "/") {
    query.isHome = true;
  }

  return {
    posts: normalizedPosts,
    pageContext: {
      page: variables.page ? parseInt(variables.page) : 1,
      perPage,
      totalPosts: parseInt(totalPosts),
      totalPages: parseInt(totalPages),
      status: ctx.response.status as Status,
      paginationPrefix,
    },
    query,
  };
};

export const cacheKey = (props: Props, req: Request, _ctx: AppContext) => {
  const url = new URL(req.url);
  return url.href + btoa(JSON.stringify(props));
};

export default loader;
