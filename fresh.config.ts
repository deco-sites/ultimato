import { defineConfig } from "$fresh/server.ts";
import { plugins } from "deco/plugins/deco.ts";
import manifest from "./manifest.gen.ts";

export default defineConfig({
  build: { target: ["chrome99", "firefox99", "safari12"] },
  plugins: plugins({
    manifest,
  }),
});
