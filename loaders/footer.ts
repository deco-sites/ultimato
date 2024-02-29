import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type {
  Menu,
  Post,
  RootQueryToMenuConnection,
  RootQueryToPostConnection,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import { MenuFields } from "deco-sites/ultimato/cms/wordpress/fragments.ts";

export interface LoaderReturn {
  posts?: Post[];
  menu?: Menu;
}

export const loader = async (
  _props: null,
  _req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const footer = await client.query<
    { menus: RootQueryToMenuConnection; posts: RootQueryToPostConnection }
  >(
    FooterQuery,
    {},
    "getFooter",
  );

  const menu = footer?.menus?.edges?.[0]?.node as Menu;
  const posts = footer?.posts?.edges?.map((edge) => edge?.node) as Post[];

  return { menu, posts };
};

const FooterQuery = gql`
  ${MenuFields}
  query getFooter {
    menus(where: {location: FOOTER}) {
      edges {
        node {
          id
          menuItems (where: {parentDatabaseId: 0}) {
            nodes {
              ...MenuFields
            }
          }
        }
      }
    }

    posts: popularPosts {
        edges {
        node {
          id
          slug
          title
          acfPostParams {
            postviews
          }
        }
      }
      }
  }
`;

export default loader;
