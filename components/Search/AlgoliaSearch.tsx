import { useEffect } from "preact/hooks";

import { liteClient as algoliasearch } from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import {
  configure,
  hits,
  poweredBy,
  searchBox,
  stats,
} from "instantsearch.js/es/widgets";

export interface Props {
  applicationId: string;
  searchApiKey: string;
  indexName: string;
  id: string;
  query?: string | null;
  resultsPage?: boolean;
}

function AlgoliaSearch(
  { applicationId, searchApiKey, indexName, id, query, resultsPage }: Props,
) {
  useEffect(() => {
    const algoliaClient = algoliasearch(
      applicationId,
      searchApiKey,
    );

    const searchClient = {
      ...algoliaClient,
      // deno-lint-ignore no-explicit-any
      search: (requests: any) => {
        // deno-lint-ignore no-explicit-any
        if (requests.every(({ params }: { params: any }) => !params?.query)) {
          return Promise.resolve({
            results: requests.map(() => ({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
              processingTimeMS: 0,
              hitsPerPage: 0,
              exhaustiveNbHits: false,
              query: "",
              params: "",
            })),
          });
        }
        return algoliaClient.search(requests);
      },
    };

    const search = instantsearch({
      indexName,
      searchClient: searchClient,
      insights: true,
      initialUiState: {
        prod_UB: {
          query: query || "",
        },
      },
    });

    let timerId: number;

    const widgets = [
      configure({
        hitsPerPage: resultsPage ? 20 : 10,
      }),
      searchBox({
        container: `#${id}-algolia-searchbox`,
        placeholder: "Digite aqui a sua busca",
        showSubmit: true,
        showReset: false,
        showLoadingIndicator: true,
        queryHook: (query, refine) => {
          clearTimeout(timerId);
          timerId = setTimeout(() => refine(query), 300);
        },
      }),
      hits({
        container: `#${id}-algolia-hits`,
        templates: {
          // deno-lint-ignore no-explicit-any
          item: ((hit: any, { html, components }: any) => {
            const title = components.Highlight({
              attribute: "title",
              hit,
              highlightedTagName: "b",
            });

            const excerpt = components.Snippet({
              attribute: "content",
              hit,
              highlightedTagName: "b",
            });

            return html`
              <a
                class="hit text-primary font-medium text-sm lg:text-base mb-3 flex"
                href="/${hit.objectID}"
              >
                <div class="w-24 h-20 lg:w-32 mr-2 lg:mr-4 lg:h-24 min-w-[6rem] min-h-[5rem] lg:min-w-[8rem] lg:min-h-[6rem]">
                  <img
                    src="https://ultimato.netlify.app${hit.image}"
                    alt="${hit.title}"
                    class="object-cover w-full h-full rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3>
                    ${title}
                  </h3>
                  <p class="hidden sm:block text-xs text-gray-400 mb-1">${hit.date}</p>
                  <p class="text-xs lg:text-sm text-gray-700 line-clamp-3">
                    ${excerpt}
                  </p>
                </div>
              </a>
            `;

            // deno-lint-ignore no-explicit-any
          }) as any,
          empty: "Nenhum resultado encontrado",
        },
      }),
      stats({
        container: `#${id}-algolia-stats`,
        templates: {
          text: ({ nbHits, processingTimeMS }) =>
            nbHits === 0
              ? ""
              : `${nbHits} resultado${
                nbHits > 1 ? "s" : ""
              } encontrados em ${processingTimeMS}ms`,
        },
      }),

      poweredBy({
        container: `#${id}-algolia-poweredby`,
        theme: "light",
      }),
    ];

    search.addWidgets(widgets);

    search.start();

    document.querySelector(`#${id}-algolia-searchbox form`)?.addEventListener(
      "submit",
      (e) => {
        const searchInput = document.querySelector(
          `#${id}-algolia-searchbox input`,
        ) as HTMLInputElement;
        const searchValue = searchInput.value;

        if (searchValue === "") {
          e.preventDefault();
        }

        globalThis.location.href = `/search?q=${searchValue}`;
      },
    );
  }, [applicationId, searchApiKey, indexName]);

  return (
    <>
      <div class="max-w-6xl w-full sm:w-4/5 px-4 mx-auto">
        <div class="overflow-hidden rounded-lg bg-white search">
          <div
            id={`${id}-algolia-searchbox`}
            class={`${resultsPage && "hidden"}`}
          >
          </div>
          <div class="flex justify-between pb-4 px-4">
            <div id={`${id}-algolia-stats`}></div>
            <div id={`${id}-algolia-poweredby`}></div>
          </div>
          <div
            id={`${id}-algolia-hits`}
            class={`bg-white ${
              !resultsPage &&
              "h-full overflow-y-auto overflow-x-hidden px-4 max-h-[60vh]"
            }`}
          >
          </div>
        </div>
      </div>
    </>
  );
}

export default AlgoliaSearch;
