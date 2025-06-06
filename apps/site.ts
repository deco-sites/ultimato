import commerce, { Props as CommerceProps } from "apps/commerce/mod.ts";
import algolia, { State as AlgoliaProps } from "apps/algolia/mod.ts";
import { color as shopify } from "apps/shopify/mod.ts";
import { color as vnda } from "apps/vnda/mod.ts";
import { color as vtex } from "apps/vtex/mod.ts";
import { color as wake } from "apps/wake/mod.ts";
import { color as linx } from "apps/linx/mod.ts";
import { color as nuvemshop } from "apps/nuvemshop/mod.ts";
import { rgb24 } from "std/fmt/colors.ts";
import manifest, { Manifest } from "../manifest.gen.ts";
import type { Secret } from "apps/website/loaders/secret.ts";
import { type Section } from "@deco/deco/blocks";
import { type App as A, type AppContext as AC } from "@deco/deco";
export type AlgoliaOpts = AlgoliaProps & {
  indexName: string;
};
export type Props = {
  /**
   * @title Active Commerce Platform
   * @description Choose the active ecommerce platform
   * @default custom
   */
  platform: Platform;
  theme?: Section;
  algolia?: AlgoliaOpts;
  wordpress?: {
    /**
     * @title Wordpress Site URL
     * @description The URL of the Wordpress Site
     */
    url: string;
    /**
     * @title Wordpress username
     * @description The username of the Wordpress Site
     */
    username: string;
    /**
     * @title Wordpress password
     * @description The password of the Wordpress Site
     */
    password: Secret;
  };
} & CommerceProps;
export type Platform =
  | "vtex"
  | "vnda"
  | "shopify"
  | "wake"
  | "linx"
  | "nuvemshop"
  | "custom";
export let _platform: Platform = "custom";
const color = (platform: string) => {
  switch (platform) {
    case "vtex":
      return vtex;
    case "vnda":
      return vnda;
    case "wake":
      return wake;
    case "shopify":
      return shopify;
    case "linx":
      return linx;
    case "nuvemshop":
      return nuvemshop;
    case "deco":
      return 0x02f77d;
    default:
      return 0x212121;
  }
};
let firstRun = true;
export default function Site({ theme, ...state }: Props): A<Manifest, Props, [
  ReturnType<typeof commerce>,
]> {
  _platform = state.platform || state.commerce?.platform || "custom";
  // Prevent console.logging twice
  if (firstRun) {
    firstRun = false;
    console.info(
      ` 🐁 ${rgb24("Storefront", color("deco"))} | ${
        rgb24(_platform, color(_platform))
      } \n`,
    );
  }
  return {
    state,
    manifest,
    dependencies: [
      commerce({
        ...state,
        global: theme ? [...(state.global ?? []), theme] : state.global,
      }),
    ],
  };
}
export { onBeforeResolveProps } from "apps/website/mod.ts";
export type App = ReturnType<typeof Site>;
export type AppContext = AC<App & Pick<ReturnType<typeof algolia>, "manifest">>;
