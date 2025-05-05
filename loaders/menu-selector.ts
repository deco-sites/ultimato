import { fetchUB as fetch } from "deco-sites/ultimato/cms/wordpress/client.ts";
import type { AppContext } from "../apps/site.ts";
import { allowCorsFor } from "@deco/deco";
export interface Menus {
  /** @description 	Unique identifier for the term. */
  id: number;
  /** @description An alphanumeric identifier for the term unique to its type. */
  slug: string;
  /** @description 	HTML title for the term. */
  name: string;
  /** @description HTML description of the term. */
  description: string;
}
/** @title Wordpress menu list */
/** @description Fetches the existing menus */
const loader = async (_props: unknown, req: Request, ctx: AppContext) => {
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });
  const wpUsername = ctx.wordpress?.username;
  const wpPassword = ctx.wordpress?.password.get() ||
    Deno.env.get("WP_PASSWORD");
  const menuCollection = await fetch.wp<Menus[]>("/menus?per_page=100", {
    /* basic auth */
    headers: {
      Authorization: `Basic ${btoa(`${wpUsername}:${wpPassword}`)}`,
    },
  });
  const slugsIds = menuCollection.content.map((menu) => {
    return `${menu.slug} | ${menu.id}`;
  });
  return slugsIds;
};
export default loader;
