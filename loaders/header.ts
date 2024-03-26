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
import type { AppContext } from "deco-sites/ultimato/apps/site.ts";

export interface Props {
  /** @description Cover section. */
  cover?: Section;
}

export interface LoaderReturn {
  cover?: Section;
  menu?: Menu;
  algoliaOpts?: {
    applicationId?: string;
    searchApiKey?: string;
    indexName?: string;
  };
}

export const loader = async (
  { cover }: Props,
  _req: Request,
  ctx: AppContext,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const header = await client.query<{ menus: RootQueryToMenuConnection }>(
    HeaderQuery,
    {},
    "getMenus",
  );

  const menu = header?.menus?.edges?.[0]?.node as Menu;

  return {
    menu,
    cover,
    algoliaOpts: ctx.algolia,
  };
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
