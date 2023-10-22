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

import { camelize } from "deco-sites/ultimato/utils/content.tsx";

/** @title {{{name}}} */
export interface Category {
  /** @description Nome da categoria */
  name: string;
  /** @description ID das categorias (ex: 10,23,139) */
  ids: string;
}

export interface Props {
  /** @description Grupos de categorias */
  categories: Category[];
}

export interface LoaderReturn {
  categories?: { name: string; ids: number[]; posts: Post[]; slug: string }[];
}

export type Response = { [key: string]: RootQueryToPostConnection };

export const loader = async (
  { categories }: Props,
  _req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const categoriesList = categories?.map(({ ids, name }) => {
    return {
      name,
      slug: camelize(name),
      ids: ids.split(",").map((id) => Number(id)),
    };
  });

  const postList = await client.query<Response>(
    PostsQuery(categoriesList),
    {},
    "getCategories",
  );

  const posts = categoriesList?.map(({ name, slug, ids }) => {
    // return postConnection where key is slug
    const postConnection = postList?.[slug];

    // return posts from connection
    const categoryPosts = postConnection?.edges?.map((edge) => {
      return edge?.node as Post;
    });

    return {
      name,
      slug,
      ids,
      posts: categoryPosts || [],
    };
  });

  return { categories: posts };
};

const PostsQuery = (list: {
  slug: string;
  ids: number[];
}[]) => {
  const repeatingPart = `{
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
  }`;

  const q = list.map(({ slug, ids }) => {
    return `${slug}: posts(
      where: {
        offsetPagination: { size: 3 }
        orderby: { field: DATE, order: DESC }
        categoryIn: ${JSON.stringify(ids)}
      }
    ) ${repeatingPart}`;
  });

  const query = gql`
  ${FeaturedImageFields}
  ${PostArchiveFields}
  query getCategories {
    ${q.join("\n")}
  }
`;

  return query;
};

export default loader;
