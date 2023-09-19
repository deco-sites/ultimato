import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type {
  Menu,
  RootQueryToMenuConnection,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  MenuChildren,
  MenuFields,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

import { Section } from "deco/blocks/section.ts";

export interface Props {
  /** @description Cover section. */
  cover?: Section;
}

export interface LoaderReturn {
  cover?: Section;
  menu?: Menu;
}

export const loader = async (
  { cover }: Props,
  _req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const header = await client.query<{ menus: RootQueryToMenuConnection }>(
    HeaderQuery,
    {},
    "getMenus",
  );

  const menu = header?.menus?.edges?.[0]?.node as Menu;

  return { menu, cover };
};

const HeaderQuery = gql`
  ${MenuFields}
  ${MenuChildren}
  query getMenus {
    menus(where: {location: PRIMARY}) {
      edges {
        node {
          id
          menuItems (where: {parentDatabaseId: 0}) {
            nodes {
              ...MenuFields
              ...MenuChildren
            }
          }
        }
      }
    }
  }
`;

export default loader;
