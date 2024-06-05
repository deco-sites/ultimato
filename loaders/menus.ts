import { fetchUB as fetch } from "deco-sites/ultimato/cms/wordpress/client.ts";

import type { AppContext } from "../apps/site.ts";

import {
  type DecoMenu as _DecoMenu,
  toMenu,
} from "deco-sites/ultimato/utils/transform.ts";

export interface NavMenu {
  id: number;
  items: NavMenuItem[];
}

export interface NavMenuItem {
  title: {
    rendered: string;
  };
  id: number;
  parent: number;
  classes: string[];
  attr_title: string;
  target: string;
  url: string;
  menus: NavMenu["id"];
}

export interface Props {
  /**
   * @format dynamic-options
   * @options deco-sites/ultimato/loaders/menu-selector.ts
   * @description id do menu a ser adicionado
   */
  menu?: string;
}

export interface DecoMenu {
  menu: _DecoMenu;
}

const loader = async (
  { menu }: Props,
  _req: Request,
  ctx: AppContext,
): Promise<DecoMenu> => {
  const wpUsername = ctx.wordpress?.username;
  const wpPassword = ctx.wordpress?.password.get() ||
    Deno.env.get("WP_PASSWORD");

  const menuID = menu?.split(" | ")[1];

  const menus = await fetch.wp<NavMenuItem[]>(
    `/menu-items?menus=${menuID}&per_page=100`,
    {
      /* basic auth */
      headers: {
        Authorization: `Basic ${btoa(`${wpUsername}:${wpPassword}`)}`,
      },
    },
  );

  const formattedMenu = toMenu({
    id: Number(menuID),
    items: menus.content,
  });

  return {
    menu: formattedMenu,
  };
};

export default loader;

export const cache = "stale-while-revalidate";
