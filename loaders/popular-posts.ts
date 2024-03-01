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

  /** @description Categoria */
  categoria?: string;

  /** @description Color Scheme */
  colorScheme?: "dark" | "light";
}

export interface LoaderReturn {
  posts?: Post[];
  adPosition?: "alternating" | "end";
  colorScheme?: "dark" | "light";
}

export const loader = async (
  { adPosition, categoria, colorScheme }: Props,
  req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const urlPath = new URL(req.url).pathname;
  const urlArrayPath = urlPath.slice(1).split("/");

  const indexOfCategory = urlArrayPath.indexOf("categoria");
  const isCategoryPage = indexOfCategory !== -1;

  const indexOfHqs = urlArrayPath.indexOf("hqs");
  const isHqsPage = indexOfHqs !== -1;

  const hqs = isHqsPage ? urlArrayPath[indexOfHqs + 1] : undefined;

  const category = categoria ||
    (isCategoryPage ? urlArrayPath[indexOfCategory + 1] : undefined) || hqs;



  const postList = await client.query<
    { popularPostsByCategory: RootQueryToPostConnection }
  >(
    PostsQuery,
    { categoryName: category },
    "getPopular",
  );

  const posts = postList?.popularPostsByCategory?.edges?.map((edge) => {
    return edge?.node as Post;
  });

  return { posts, adPosition, colorScheme };
};

const PostsQuery = gql`
  ${FeaturedImageFields}
  ${PostArchiveFields}
  query getPopular ($categoryName: String = ""){
    popularPostsByCategory (
    where: {
      categoryName: $categoryName
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
