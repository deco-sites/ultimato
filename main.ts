/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="deno.ns" />
/// <reference lib="esnext" />

import { $live } from "deco/mod.ts";
import manifest from "./live.gen.ts";
import { start } from "$fresh/server.ts";
import decoPlugins from "deco-sites/std/plugins/mod.ts";
import partytownPlugin from "partytown/mod.ts";
import site from "./site.json" assert { type: "json" };

await start($live(manifest, site), {
  plugins: [
    ...decoPlugins(),
    partytownPlugin(),
  ],
});
