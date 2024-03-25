import Logo from "deco-sites/ultimato/components/ui/Logo.tsx";
import Menu from "deco-sites/ultimato/islands/Menu.tsx";
import Search from "deco-sites/ultimato/components/Search/Search.tsx";

import loader from "deco-sites/ultimato/loaders/header.ts";

import GenericCover from "deco-sites/ultimato/components/ui/GenericCover.tsx";

import type { SectionProps } from "deco/mod.ts";

function Header(
  { cover, menu, algoliaOpts }: SectionProps<
    typeof loader
  >,
) {
  return (
    <>
      <header class="absolute top-0 z-30 w-full">
        <div class="container px-4 py-4 lg:py-8">
          <div class="navbar justify-between">
            <div class="order-2 lg:order-1 w-48 lg:w-64 z-20">
              <Logo />
            </div>

            {menu && (
              <div class="order-1 lg:order-2">
                <Menu data={menu} />
              </div>
            )}

            <div class="order-3 self-center">
              {algoliaOpts?.appId && algoliaOpts?.indexName && (
                <>
                  <Search
                    appId={algoliaOpts?.appId}
                    apiKey={Deno.env.get("ALGOLIA_SEARCH_KEY") ||
                      algoliaOpts?.apiKey as string}
                    indexName={algoliaOpts?.indexName}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      {cover
        ? <cover.Component {...cover.props} />
        : <GenericCover title="Erro 404" />}
    </>
  );
}

export default Header;
export { loader };
