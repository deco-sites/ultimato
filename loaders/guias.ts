import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type {
  Post,
  RootQueryToPostConnection,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  FeaturedImageFields,
  PostArchiveFields,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

export interface Props {
  /** @description Mostrar Anúncios? */
  adPosition?: "alternating" | "end";
}

export interface LoaderReturn {
  posts?: Post[];
  adPosition?: "alternating" | "end";
}

export const loader = async (
  { adPosition }: Props,
  req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  console.log(req);

  const postList = await client.query<{ guias: RootQueryToPostConnection }>(
    PostsQuery,
    {},
    "getGuias",
  );

  const posts = postList?.guias?.edges?.map((edge) => {
    return edge?.node as Post;
  });

  return { posts, adPosition };
};

const PostsQuery = gql`
  ${FeaturedImageFields}
  ${PostArchiveFields}
  query getGuias {
    guias: posts(
    where: {
      offsetPagination: { size: 8 }
      orderby: { field: DATE, order: DESC }
      categoryName: "guias"
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
    }
  }
`;

export default loader;
