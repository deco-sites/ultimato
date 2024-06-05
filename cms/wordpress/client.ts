import { fetchAPI } from "deco/utils/fetchAPI.ts";

import { fetchAPI as _fetchAPI } from "deco-sites/ultimato/utils/fetch.ts";

import type { DecoRequestInit } from "apps/utils/fetch.ts";

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

interface Endpoint {
  base: string;
  options: DecoRequestInit;
}

type FetchEndpoints = {
  [K in "wp" | "yoast" | "cf7" | "jwt" | "ub"]: Endpoint;
};

export const adminUrl = "https://admin.ultimatodobacon.com";
const restEndpoint = `${adminUrl}/wp-json`;

const endpoints: FetchEndpoints = {
  wp: { base: `${restEndpoint}/wp/v2`, options: {} as DecoRequestInit },
  yoast: { base: `${restEndpoint}/yoast/v1`, options: {} as DecoRequestInit },
  cf7: {
    base: `${restEndpoint}/contact-form-7/v1`,
    options: {} as DecoRequestInit,
  },
  jwt: { base: `${restEndpoint}/jwt-auth/v1`, options: {} as DecoRequestInit },
  ub: { base: `${restEndpoint}/ub/v1`, options: {} as DecoRequestInit },
};

function createFetch<T extends Record<string, Endpoint>>(endpoints: T) {
  const fetchFunctions = {} as {
    [K in keyof T]: <R>(
      path: string,
      options: DecoRequestInit,
    ) => Promise<{ content: R; headers: Headers }>;
  };

  for (const key in endpoints) {
    fetchFunctions[key] = async function <R>(
      path: string,
      options: DecoRequestInit = {},
    ) {
      const callAPI = await _fetchAPI<R>(
        `${endpoints[key].base}${path}`,
        options,
      );

      const headers = callAPI.headers;
      const response = callAPI.content;

      return {
        content: response as R,
        headers,
      };
    };
  }

  return fetchFunctions;
}

export const fetchUB = createFetch(endpoints);
