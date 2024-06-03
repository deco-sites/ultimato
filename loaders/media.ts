import { fetchUB as fetch } from "deco-sites/ultimato/cms/wordpress/client.ts";

import type {
  WP_REST_API_Attachments,
} from "deco-sites/ultimato/cms/wordpress/types/wp-types.ts";

import { AppContext } from "../apps/site.ts";

import { type Media, toMedia } from "deco-sites/ultimato/utils/transform.ts";

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

  /** @description  Ordenar coleção por termo de atributo. */
  orderBy?:
    | "id"
    | "author"
    | "include"
    | "date"
    | "modified"
    | "parent"
    | "slug"
    | "include_slugs"
    | "title";

  /** @description  Se deseja ocultar termos não atribuídos a posts.*/
  hideEmpty?: boolean;

  /** @description Limitar resultados de termos atribuídos a um ascendente específico. */
  parent?: number;

  /** @description Limitar resultados de termos atribuídos a um post específico. */
  post?: number;

  /** @description  Limitar resultados a termos com um ou mais slugs específicos.*/
  slug?: string[];

  /** @description Limitar resultados de posts atribuído por um ou mais status. */
  status?: "publish" | "future" | "draft" | "pending" | "private";

  /** @description Limitar resultados a anexos de um tipo de mídia em particular. */
  mediaType?: ("image" | "video" | "text" | "application" | "audio")[];
  /** @description Limitar resultados a anexos de um tipo MIME em particular. */
  mimeType?: string;
}

export interface DecoMedia {
  mediaItens: Media[];
}

/**
 *  @title Wordpress Categories Loader
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
    order = "asc",
    orderBy = "date",
    hideEmpty,
    parent,
    post,
    slug,
    mediaType,
    mimeType,
    status,
  }: Props,
  _req: Request,
  _ctx: AppContext,
): Promise<DecoMedia> => {
  const input = {
    page: page.toString(),
    per_page: perPage.toString(),
    search,
    exclude: exclude?.join(","),
    include: include?.join(","),
    after,
    author: author?.join(","), //join the array of authors into a string
    author_exclude: authorExclude?.join(","), //join the array of authors into a string
    before,
    offset: offset?.toString(),
    order,
    orderby: orderBy,
    slug: slug?.join(","), //join the array of slugs into a string
    hide_empty: hideEmpty,
    parent,
    post,
    media_type: mediaType?.join(","),
    mime_type: mimeType,
    status,
  };

  const variables = Object.fromEntries(
    Object.entries(input)
      .filter(([_, value]) =>
        value !== undefined && value !== "" && value !== null
      )
      .map(([key, value]) => [key, value as string]),
  ) as { [k: string]: string };

  const path = `/media?${new URLSearchParams(variables)}`;

  const response = await fetch.wp<WP_REST_API_Attachments>(path, {});

  const normalizedMedia = response.content.map((media) => toMedia(media));

  return { mediaItens: normalizedMedia };
};

export default loader;
