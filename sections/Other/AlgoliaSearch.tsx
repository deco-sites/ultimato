import type { AlgoliaOpts, AppContext } from "deco-sites/ultimato/apps/site.ts";
import Search from "deco-sites/ultimato/components/Search/Search.tsx";
import { type SectionProps } from "@deco/deco";
export const loader = (
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): AlgoliaOpts => {
  return ctx.algolia as AlgoliaOpts;
};
export default function AlgoliaSearch(
  { applicationId, searchApiKey, indexName }: SectionProps<typeof loader>,
) {
  if (!applicationId || !searchApiKey || !indexName) {
    return null;
  }
  return (
    <>
      <Search
        applicationId={applicationId}
        searchApiKey={Deno.env.get("ALGOLIA_SEARCH_KEY") ||
          searchApiKey as string}
        indexName={indexName}
      />
    </>
  );
}
