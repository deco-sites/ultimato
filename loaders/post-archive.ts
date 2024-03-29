import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type {
  Category as CategoryType,
  OffsetPaginationPageInfo,
  Post,
  PostTypeSeo,
  RootQueryToPostConnection,
  TaxonomySeo,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  FeaturedImageFields,
  PostArchiveFields,
  SeoFields,
  SeoFieldsTax,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

import { Section } from "deco/blocks/section.ts";
import { FnContext } from "deco/types.ts";

export type PageInfo = OffsetPaginationPageInfo & {
  limit: number;
  skip: number;
  totalPages: number;
  pageNumber: number;
  pathPrefix: string;
};

export interface Props {
  /** @description Quantidade de posts */
  postNumber?: number;

  /** @description Sidebar */
  sidebar?: Section;

  /** @description Categoria */
  categoria?: string;

  /** @description Color Scheme */
  colorScheme?: "dark" | "light";

  /** @description Show Featured */
  showFeatured?: boolean;

  /** @description Call to Action */
  callToAction?: Section;
}

export interface LoaderReturn {
  posts?: Post[];
  sidebar?: Section;
  pageInfo: PageInfo;
  category?: {
    name?: string;
    seo?: TaxonomySeo;
  };
  colorScheme?: "dark" | "light";
  showFeatured?: boolean;
  callToAction?: Section;
  home?: {
    seo: PostTypeSeo;
  };
}

export const loader = async (
  { postNumber, sidebar, categoria, colorScheme, showFeatured, callToAction }:
    Props,
  req: Request,
  ctx: FnContext,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const urlPath = new URL(req.url).pathname;
  const urlArrayPath = urlPath.slice(1).split("/");

  const indexOfPage = urlArrayPath.indexOf("page");
  const isPaginated = indexOfPage !== -1;

  const indexOfCategory = urlArrayPath.indexOf("categoria");
  const isCategoryPage = indexOfCategory !== -1;

  const indexOfHqs = urlArrayPath.indexOf("hqs");
  const isHqsPage = indexOfHqs !== -1;

  const hqs = isHqsPage ? urlArrayPath[indexOfHqs + 1] : undefined;

  const category = categoria ||
    (isCategoryPage ? urlArrayPath[indexOfCategory + 1] : undefined) || hqs;

  const page = isPaginated ? parseInt(urlArrayPath[indexOfPage + 1]) : 0;

  const variables = {
    limit: postNumber || 10,
    skip: isPaginated ? (page - 1) * (postNumber || 10) : 0,
    category,
  };

  const categoryInfo = category
    ? await client.query<
      {
        category: {
          name: string;
          seo: TaxonomySeo;
          parent: { node: CategoryType };
        };
      }
    >(
      CategoryQuery,
      { id: category },
      "getCategory",
    )
    : undefined;

  if (
    isHqsPage && categoryInfo?.category?.parent?.node?.slug !== "quadrinhos"
  ) {
    ctx.response.status = 404;
    return {
      posts: [],
      pageInfo: {
        limit: 0,
        skip: 0,
        totalPages: 0,
        pageNumber: 0,
        pathPrefix: "",
      },
    };
  }

  const postList = await client.query<
    { posts: RootQueryToPostConnection; home: { seo: PostTypeSeo } }
  >(
    PostsQuery,
    variables,
    "getPostsArchive",
  );

  const posts = postList?.posts?.edges?.map((edge) => {
    return edge?.node as Post;
  });

  const totalPages = postList?.posts?.pageInfo
      ?.offsetPagination?.total as number <= variables.limit
    ? 1
    : Math.ceil(
      (postList?.posts?.pageInfo
        ?.offsetPagination?.total as number - variables.limit) /
        variables.limit,
    ) + 1;

  // calculate current page number
  const pageNumber = Math.ceil(variables.skip / variables.limit) + 1;

  const pageInfo = {
    ...postList?.posts?.pageInfo
      ?.offsetPagination,
    limit: variables.limit,
    skip: variables.skip,
    totalPages,
    pageNumber,
    pathPrefix: hqs ? `/hqs/${category}` : category ? `/hqs/${category}` : "/",
  } as PageInfo;

  return {
    posts,
    sidebar,
    pageInfo,
    category: {
      name: categoryInfo?.category?.name,
      seo: categoryInfo?.category?.seo,
    },
    colorScheme,
    showFeatured,
    callToAction,
    home: postList?.home,
  };
};

const PostsQuery = gql`
  ${FeaturedImageFields}
  ${PostArchiveFields}
  ${SeoFields}
  query getPostsArchive($limit: Int!, $skip: Int!, $category: String = null) {
    posts(
      where: {
        offsetPagination: { offset: $skip, size: $limit }
        orderby: { field: DATE, order: DESC }
        categoryNotIn: "6515"
        categoryName: $category
      }
    ) {
      edges {
        node {
         ...PostArchiveFields
          featuredImage {
            node {
              ...FeaturedImageFields
            }
          }
        }
      }
      pageInfo {
        offsetPagination {
          total
          hasMore
          hasPrevious
        }
      }
    }
    home: contentNode(id: "/", idType: URI) {
      seo {
        ...SeoFields
      }
    }
  }
`;

const CategoryQuery = gql`
  ${SeoFieldsTax}
  query getCategory($id: ID!) {
    category(id: $id, idType: SLUG) {
      name
      parent {
        node {
          slug
        }
      }
      seo {
        ...SeoFieldsTax
      }
    }
  }
`;

export default loader;
