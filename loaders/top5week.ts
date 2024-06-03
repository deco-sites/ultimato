import type {
  RootQueryToPostConnection,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import {
  FeaturedImageFields,
  PostArchiveFields,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

import type {
  Props,
  Selectors,
} from "deco-sites/ultimato/components/HQSelectorList.tsx";

export type LoaderProps = {
  selectors: Selectors[];
  posts: FeaturedPostsSectionProps | undefined;
};

export type FeaturedPostsSectionProps = {
  featured: RootQueryToPostConnection;
};

export const loader = async (
  { selectors }: Props,
  _req: Request,
): Promise<LoaderProps> => {
  const client = createClient({ endpoint });

  const posts = await client.query<FeaturedPostsSectionProps>(
    PageQuery,
    {},
    "getFeaturedPosts",
  );

  return { selectors, posts };
};

const PageQuery = gql`
  ${FeaturedImageFields}
  ${PostArchiveFields}
  query getFeaturedPosts {
    featured: posts(
      where: {
        offsetPagination: { size: 50 }
        orderby: { field: DATE, order: DESC }
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
          acfPostParams {
            postviews
          }
        }
      }
    }
  }`;

export default loader;
