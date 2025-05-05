import { cleanUpUrl /* , isExternalURL */ } from "deco-sites/ultimato/utils/url.ts";

import { DecoMenuItem } from "deco-sites/ultimato/utils/transform.ts";

export interface Props {
  name: DecoMenuItem["title"];
  href: DecoMenuItem["url"];
  cssClasses?: DecoMenuItem["classes"];
  target?: DecoMenuItem["target"];
  children?: DecoMenuItem["children"];
  submenu?: boolean;
}

function MenuItem(
  { name, cssClasses, children, href, submenu }: Props,
) {
  const menuItemParentClasses =
    "uppercase font-bold active:text-white focus:!text-white hover:text-white";

  return (
    <>
      {href && !children?.length
        ? (
          <li className={`${cssClasses?.join(" ")}`}>
            <a
              href={cleanUpUrl(href)}
              className={`justify-center lg:justify-start ${
                !submenu ? menuItemParentClasses : "is-submenu"
              }`}
            >
              <span
                tabIndex={0}
              >
                {name}
              </span>
            </a>
          </li>
        )
        : null}
      {href && children?.length
        ? (
          <li className={`${cssClasses?.join(" ")}`}>
            <details className={`${!submenu ? "parent" : ""}`}>
              <summary
                tabIndex={0}
                className={`justify-center lg:justify-start ${
                  !submenu ? menuItemParentClasses : "is-submenu"
                }`}
              >
                {name}
              </summary>
              <ul
                tabIndex={0}
                className={`menu-dropdown lg:text-black lg:bg-white ml-0 lg:ml-4 pl-0 lg:pl-2 ${
                  !submenu ? "lg:w-48" : "is-submenu"
                }`}
              >
                {children.map((child) => (
                  <MenuItem
                    key={child.id}
                    cssClasses={child.classes as string[]}
                    href={child?.url as string}
                    name={child.title}
                    // deno-lint-ignore jsx-no-children-prop
                    children={child.children as DecoMenuItem[]}
                    submenu
                  />
                ))}
              </ul>
            </details>
          </li>
        )
        : null}
    </>
  );
}

export default MenuItem;
