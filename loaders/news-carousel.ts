import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type {
  Category as CategoryType,
  Post,
  RootQueryToPostConnection,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  FeaturedImageFields,
  PostArchiveFields,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

import { FnContext } from "deco/types.ts";

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
  ctx: FnContext,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const urlPath = new URL(req.url).pathname;
  const urlArrayPath = urlPath.slice(1).split("/");

  const indexOfCategory = urlArrayPath.indexOf("hqs");
  const isCategoryPage = indexOfCategory !== -1;

  const indexOfHqs = urlArrayPath.indexOf("hqs");
  const isHqsPage = indexOfHqs !== -1;

  const category = categoria ||
    (isCategoryPage ? urlArrayPath[indexOfCategory + 1] : undefined);

  const variables = {
    postNumber: postNumber || 5,
    category: category || "slider",
    categoryID: category || "slider",
  };

  const postList = await client.query<
    {
      posts: RootQueryToPostConnection;
      category: { parent: { node: CategoryType } };
    }
  >(
    SliderQuery,
    variables,
    "getNewsSlider",
  );

  if (isHqsPage && postList?.category?.parent?.node?.slug !== "quadrinhos") {
    ctx.response.status = 404;
    return {
      posts: [],
    };
  }

  const posts = postList?.posts?.edges?.map((edge) => {
    return edge?.node as Post;
  });

  return { posts };
};

const SliderQuery = gql`
  ${FeaturedImageFields}
  ${PostArchiveFields}
  query getNewsSlider($postNumber: Int!, $category: String!, $categoryID: ID!) {
  category (id: $categoryID, idType: SLUG) {
    parent {
      node {
        slug
      }
    }
  }
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
