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
  /** @description Quantidade de posts */
  postNumber?: number;
}

export interface LoaderReturn {
  posts?: Post[];
}

export const loader = async (
  { postNumber }: Props,
  _req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const variables = {
    postNumber: postNumber || 5,
  };

  const postList = await client.query<{ posts: RootQueryToPostConnection }>(
    SliderQuery,
    variables,
    "getNewsSlider",
  );

  const posts = postList?.posts?.edges?.map((edge) => {
    return edge?.node as Post;
  });

  return { posts };
};

const SliderQuery = gql`
  ${FeaturedImageFields}
  ${PostArchiveFields}
  query getNewsSlider($postNumber: Int!) {
  posts(
      where: {
      offsetPagination: { size: $postNumber }
      orderby: { field: DATE, order: DESC }
      categoryName: "slider"
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
