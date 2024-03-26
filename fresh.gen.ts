// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_app from "./routes/_app.tsx";
import * as $AlgoliaSearch from "./islands/AlgoliaSearch.tsx";
import * as $AlgoliaSearchPage from "./islands/AlgoliaSearchPage.tsx";
import * as $Backdrop from "./islands/Backdrop.tsx";
import * as $CookiePrompt from "./islands/CookiePrompt.tsx";
import * as $FlyingBacons from "./islands/FlyingBacons.tsx";
import * as $Menu from "./islands/Menu.tsx";
import * as $PigsSlider from "./islands/PigsSlider.tsx";
import * as $Slider from "./islands/Slider.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_app.tsx": $_app,
  },
  islands: {
    "./islands/AlgoliaSearch.tsx": $AlgoliaSearch,
    "./islands/AlgoliaSearchPage.tsx": $AlgoliaSearchPage,
    "./islands/Backdrop.tsx": $Backdrop,
    "./islands/CookiePrompt.tsx": $CookiePrompt,
    "./islands/FlyingBacons.tsx": $FlyingBacons,
    "./islands/Menu.tsx": $Menu,
    "./islands/PigsSlider.tsx": $PigsSlider,
    "./islands/Slider.tsx": $Slider,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
