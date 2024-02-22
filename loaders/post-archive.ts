import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type {
  OffsetPaginationPageInfo,
  Post,
  RootQueryToPostConnection,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  FeaturedImageFields,
  PostArchiveFields,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

import { Section } from "deco/blocks/section.ts";

export type PageInfo = OffsetPaginationPageInfo & {
  limit: number;
  skip: number;
  totalPages: number;
  pageNumber: number;
};

export interface Props {
  /** @description Quantidade de posts */
  postNumber?: number;

  /** @description Sidebar */
  sidebar?: Section;
}

export interface LoaderReturn {
  posts?: Post[];
  sidebar?: Section;
  pageInfo: PageInfo;
}

export const loader = async (
  { postNumber, sidebar }: Props,
  req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const urlPath = new URL(req.url).pathname

  const isPaginated = urlPath.slice(1).split("/")[0] === 'page'

  const variables = {
    limit: postNumber || 10,
    skip: isPaginated ? (parseInt(urlPath.slice(1).split("/")[1]) - 1) * (postNumber || 10) : 0,
  };

  const postList = await client.query<{ posts: RootQueryToPostConnection }>(
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
  } as PageInfo;

  return { posts, sidebar, pageInfo };
};

const PostsQuery = gql`
  ${FeaturedImageFields}
  ${PostArchiveFields}
  query getPostsArchive($limit: Int!, $skip: Int!) {
    posts(
      where: {
        offsetPagination: { offset: $skip, size: $limit }
        orderby: { field: DATE, order: DESC }
        categoryNotIn: "6515"
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
  }
`;

export default loader;
