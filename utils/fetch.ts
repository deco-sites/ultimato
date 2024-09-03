import { type DecoRequestInit, fetchSafe } from "apps/utils/fetch.ts";

type FetchReturn<T> = {
  content: T;
  headers: Headers;
};

export const fetchAPI = async <T>(
  input: string | Request | URL,
  init?: DecoRequestInit,
): Promise<FetchReturn<T>> => {
  try {
    const headers = new Headers(init?.headers);

    headers.set("accept", "application/json");

    const response = await fetchSafe(input, { ...init, headers });

    const content: T = await response.json();

    return {
      content,
      headers: response.headers,
    };
  } catch (error) {
    console.error(error);

    throw new Error(`Error fetching API at ${input}`);
  }
};
