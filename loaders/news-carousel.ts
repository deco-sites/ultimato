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

  /** @description Categoria */
  categoria?: string;
}

export interface LoaderReturn {
  posts?: Post[];
}

export const loader = async (
  { postNumber, categoria }: Props,
  req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const urlPath = new URL(req.url).pathname;
  const urlArrayPath = urlPath.slice(1).split("/");

  const indexOfCategory = urlArrayPath.indexOf("hqs");
  const isCategoryPage = indexOfCategory !== -1;

  const category = categoria ||
    (isCategoryPage ? urlArrayPath[indexOfCategory + 1] : undefined);

  const variables = {
    postNumber: postNumber || 5,
    category: category || "slider",
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
  query getNewsSlider($postNumber: Int!, $category: String!) {
  posts(
      where: {
      offsetPagination: { size: $postNumber }
      orderby: { field: DATE, order: DESC }
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
  }
}
`;

export default loader;
