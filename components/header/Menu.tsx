import { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import MenuItem from "deco-sites/ultimato/components/header/MenuItem.tsx";
import Hamburger from "deco-sites/ultimato/components/header/Hamburger.tsx";

import { signal } from "@preact/signals";

export const menuState = signal({
  open: false,
});

import type { DecoMenu } from "deco-sites/ultimato/loaders/menus.ts";

import type { DecoMenuItem } from "deco-sites/ultimato/utils/transform.ts";

export interface Props {
  data: DecoMenu;
  wrapperProps?: JSX.HTMLAttributes<HTMLDivElement>;
}

function Menu({ data, wrapperProps }: Props) {
  const navRef = useRef<HTMLMenuElement>(null);

  useEffect(() => {
    if (navRef.current) {
      // Fetch all the details element.

      const nav = navRef.current;
      const details = Array.from(
        nav.querySelectorAll("ul > li > details.parent"),
      );

      document.addEventListener("click", function (e) {
        if (!details.some((item) => item.contains(e.target as Node))) {
          details.forEach((item) => item.removeAttribute("open"));
          // close all the children details
          details.forEach((item) =>
            item.querySelector("details")?.removeAttribute("open")
          );
        } else {
          details.forEach((item) => {
            !item.contains(e.target as Node)
              ? item.removeAttribute("open")
              : "";
            // close all the children details
            !item.contains(e.target as Node)
              ? item.querySelector("details")?.removeAttribute("open")
              : "";
          });
        }
      });
    }
  }, [navRef]);

  return (
    <div {...wrapperProps}>
      <div className="lg:hidden">
        <Hamburger />
      </div>
      <nav
        className={`absolute pt-32 w-screen h-screen z-10 bg-black bg-opacity-80 top-0 left-0 lg:flex justify-center lg:pt-0 lg:relative lg:w-auto lg:h-auto lg:bg-opacity-0 lg:items-center ${
          menuState.value.open ? "flex" : "hidden"
        }`}
        ref={navRef}
      >
        <div className="overflow-y-scroll lg:overflow-y-visible">
          <ul className="text-white menu lg:menu-horizontal items-stretch">
            {data &&
              data.menu && data.menu.items &&
              (data.menu.items as DecoMenuItem[]).map((
                { id, url, title, target, classes, children },
              ) => (
                <MenuItem
                  key={id}
                  name={title}
                  href={url}
                  children={children as DecoMenuItem[]}
                  cssClasses={classes}
                  target={target}
                />
              ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Menu;
