import type { Section } from "deco/blocks/section.ts";

import type { DecoMenu } from "deco-sites/ultimato/loaders/menus.ts";

import Logo from "deco-sites/ultimato/components/ui/Logo.tsx";
import MenuIsland from "deco-sites/ultimato/islands/Menu.tsx";

import GenericCover from "deco-sites/ultimato/components/ui/GenericCover.tsx";

export interface Props {
  /** @description Cover section. */
  cover?: Section;

  /** @description Menu data. */
  menu?: DecoMenu;

  /** @description Algolia section */
  algolia?: Section;
}

function Header(
  { cover, menu, algolia }: Props,
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
                <MenuIsland data={menu} />
              </div>
            )}

            <div class="order-3 self-center">
              {algolia && (
                <>
                  <algolia.Component {...algolia.props} />
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
