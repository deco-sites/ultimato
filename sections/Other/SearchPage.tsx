import { useId } from "preact/hooks";
import type { AppContext } from "deco-sites/ultimato/apps/site.ts";
import type { State as AlgoliaProps } from "apps/algolia/mod.ts";
import AlgoliaSearch from "deco-sites/ultimato/islands/AlgoliaSearch.tsx";
import Seo from "deco-sites/ultimato/components/Seo.tsx";
import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";
import { type SectionProps } from "@deco/deco";
interface LoaderReturn {
  searchQuery: string | null;
  algolia?: AlgoliaProps & {
    indexName: string;
  };
}
function SearchPage({ searchQuery, algolia }: SectionProps<typeof loader>) {
  const algoliaId = useId();
  return (
    <div class="container mx-auto pt-24">
      <Seo
        seo={{
          title: `Resultados de busca para "${searchQuery}"`,
          metaDesc: `Resultados de busca para "${searchQuery}"`,
          canonical: "/search",
        }}
      />
      <div class="max-w-6xl w-full sm:w-4/5 px-4 mx-auto">
        <SectionTitle tag="h2">
          Resultados de busca para "{searchQuery}"
        </SectionTitle>
      </div>

      <AlgoliaSearch
        {...algolia as AlgoliaProps & {
          indexName: string;
        }}
        id={algoliaId}
        query={searchQuery}
        resultsPage
      />
    </div>
  );
}
export const loader = (
  _props: unknown,
  req: Request,
  ctx: AppContext,
): LoaderReturn => {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("q");
  return {
    searchQuery,
    algolia: ctx.algolia,
  };
};
export default SearchPage;
