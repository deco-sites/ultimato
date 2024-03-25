import { useEffect } from "preact/hooks";

import algoliasearch from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { hits, poweredBy, searchBox, stats } from "instantsearch.js/es/widgets";

export interface Props {
  appId: string;
  apiKey: string;
  indexName: string;
  wrapperId: string;
  buttonId: string;
}

function AlgoliaSearch(
  { appId, apiKey, indexName, buttonId, wrapperId }: Props,
) {
  useEffect(() => {
    const button = document.getElementById(buttonId);
    const element = document.getElementById(wrapperId);

    let isOpen = false;

    if (button) {
      button.addEventListener("click", () => {
        if (element) {
          element.classList.toggle("hidden");
          element.classList.toggle("block");
        }

        button.querySelector(".open")?.classList.toggle("hidden");
        button.querySelector(".close")?.classList.toggle("hidden");
        document.body.classList.toggle("overflow-hidden");

        isOpen = !isOpen;

        if (isOpen) {
          // focus on the search input
          element?.querySelector("input")?.focus();

          // close on click outside
          element?.addEventListener("click", (e) => {
            const searchEl = element?.querySelector(".search");

            if (element && !searchEl?.contains(e.target as Node)) {
              element.classList.add("hidden");
              element.classList.remove("block");

              button.querySelector(".open")?.classList.remove("hidden");
              button.querySelector(".close")?.classList.add("hidden");
              document.body.classList.remove("overflow-hidden");

              isOpen = false;
            }
          });
        }
      });
    }
  }, [buttonId, wrapperId]);

  useEffect(() => {
    const algoliaClient = algoliasearch(
      appId,
      apiKey,
    );

    const search = instantsearch({
      indexName,
      searchClient: algoliaClient,
      insights: true,
      initialUiState: {
        searchBox: {
          query: "",
        },
      },
    });

    let timerId: number;

    search.addWidgets([
      searchBox({
        container: "#algolia-searchbox",
        placeholder: "Digite aqui a sua busca",
        showSubmit: true,
        showReset: false,
        showLoadingIndicator: true,
        queryHook: (query, refine) => {
          clearTimeout(timerId);
          timerId = setTimeout(() => refine(query), 200);
        },
      }),
      hits({
        container: "#algolia-hits",
        templates: {
          item: (hit, { html, components }) =>
            html`
              <a class="hit text-primary font-medium text-sm lg:text-base mb-3" href="/${hit.objectID}">
                <h3>
                  ${
              components.Highlight({
                attribute: "title",
                hit,
                highlightedTagName: "b",
              })
            }
                </h3>
                <p class="hidden sm:block text-xs text-gray-400 mb-1">${hit.date}</p>
                <p class="text-xs lg:text-sm text-gray-700 line-clamp-3">
                  ${
              components.Snippet({
                attribute: "content",
                hit,
                highlightedTagName: "b",
              })
            }
                </p>
              </a>
            `,
          empty: "Nenhum resultado encontrado",
        },
      }),
      stats({
        container: "#algolia-stats",
        templates: {
          text: ({ nbHits, processingTimeMS }) =>
            nbHits === 0
              ? "Nenhum resultado encontrado"
              : `${nbHits} resultado${
                nbHits > 1 ? "s" : ""
              } encontrados em ${processingTimeMS}ms`,
        },
      }),

      poweredBy({
        container: "#algolia-poweredby",
        theme: "light",
      }),
    ]);

    search.start();
  }, [appId, apiKey, indexName]);

  return (
    <>
      <div class="max-w-6xl w-full sm:w-4/5 px-4 mx-auto">
        <div class="overflow-hidden rounded-lg bg-white search">
          <div id="algolia-searchbox"></div>
          <div class="flex justify-between pb-4 px-4">
            <div id="algolia-stats"></div>
            <div id="algolia-poweredby"></div>
          </div>
          <div
            id="algolia-hits"
            class="h-full overflow-y-auto overflow-x-hidden px-4 max-h-[60vh] bg-white"
          >
          </div>
        </div>
      </div>
    </>
  );
}

export default AlgoliaSearch;
