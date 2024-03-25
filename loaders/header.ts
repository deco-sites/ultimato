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
import { Secret } from "apps/website/loaders/secret.ts";

export interface Props {
  /** @description Cover section. */
  cover?: Section;

  /** @description Algolia configuration. */
  algoliaOpts?: {
    appId: string;
    apiKey: Secret;
    indexName: string;
  };

}

export interface LoaderReturn {
  cover?: Section;
  menu?: Menu;
  algoliaOpts?: {
    appId?: string;
    apiKey?: string;
    indexName?: string;
  };
}

export const loader = async (
  { cover, algoliaOpts }: Props,
  _req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const header = await client.query<{ menus: RootQueryToMenuConnection }>(
    HeaderQuery,
    {},
    "getMenus",
  );

  const menu = header?.menus?.edges?.[0]?.node as Menu;

  const apiKey = algoliaOpts?.apiKey.get() as string;

  return {
    menu,
    cover,
    algoliaOpts: { ...algoliaOpts, apiKey },
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
