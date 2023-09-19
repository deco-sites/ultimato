import Logo from "deco-sites/ultimato/components/ui/Logo.tsx";
import Menu from "deco-sites/ultimato/islands/Menu.tsx";
import Icon from "deco-sites/ultimato/components/ui/Icon.tsx";

import loader from "deco-sites/ultimato/loaders/header.ts";

import type { SectionProps } from "deco/mod.ts";

function Header({ cover, menu }: SectionProps<typeof loader>) {
  return (
    <>
      <header className="absolute top-0 z-30 w-full">
        <div className="container px-4 py-8">
          <div className="navbar justify-between">
            <div className="order-2 lg:order-1 w-48 lg:w-64 z-20">
              <Logo />
            </div>

            {menu && (
              <div className="order-1 lg:order-2">
                <Menu data={menu} />
              </div>
            )}

            <div className="order-3 self-center">
              <Icon
                id="MagnifyingGlass"
                width={32}
                height={32}
                className="fill-current text-white"
              />
              {/* <Search /> */}
            </div>
          </div>
        </div>
      </header>
      {cover && <cover.Component {...cover.props} />}
    </>
  );
}

export default Header;
export { loader };
