import { fetchAPI } from "deco/utils/fetchAPI.ts";

import { fetchSafe } from "apps/utils/fetch.ts";

import { createHttpClient } from "apps/utils/http.ts";
import { OpenAPI } from "deco-sites/ultimato/cms/wordpress/types/wp.openapi.gen.ts";

// Use wordpress GraphQL API
export const endpoint = "https://admin.ultimatodobacon.com/graphql";

// Implementation from https://github.com/deco-cx/apps/blob/29fcea976c0ba19006d45c26fa7ee525e8fa90a3/utils/graphql.ts#L22
export const gql = (query: TemplateStringsArray, ...fragments: string[]) =>
  query.reduce((a, c, i) => `${a}${fragments[i - 1]}${c}`);

export interface ConfigWordpress {
  /**
   * @description Wordpress GraphQL endpoint
   */
  endpoint: string;
}

// Implementation from https://github.com/deco-sites/std/blob/1.14.10/commerce/shopify/client.ts

export const createClient = ({
  endpoint = "http://localhost:8080/graphql",
}: Partial<ConfigWordpress> = {}) => {
  const query = async <T>(
    query: string,
    variables: Record<string, unknown> = {},
    operationName?: string,
  ) => {
    const { data, errors } = await fetchAPI<{ data?: T; errors: unknown[] }>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify({
          query,
          variables,
          operationName,
        }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      },
    );

    if (Array.isArray(errors) && errors.length > 0) {
      console.error(Deno.inspect(errors, { depth: 100, colors: true }));

      throw new Error(
        `Error while running query:\n${query}\n\nVariables:\n${
          JSON.stringify(variables)
        }`,
      );
    }

    return data;
  };

  return {
    query,
  };
};

export const adminUrl = "https://admin.ultimatodobacon.com";
const restEndpoint = `${adminUrl}/wp-json`;

export const fetch = createHttpClient<OpenAPI>({
  base: restEndpoint,
  fetcher: fetchSafe,
});
