import { defineApp } from "$fresh/server.ts";
import { Context } from "deco/deco.ts";
import { asset, Head } from "$fresh/runtime.ts";
import GoogleTagManager from "partytown/integrations/GTM.tsx";
import GlobalTags from "deco-sites/ultimato/components/GlobalTags.tsx";
import Theme from "deco-sites/ultimato/sections/Theme.tsx";

const trackingId = "";

const sw = () =>
  addEventListener("load", () =>
    navigator && navigator.serviceWorker &&
    navigator.serviceWorker.register("/sw.js"));

export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision();

  return (
    <>
      {/* Include default fonts and css vars */}
      <Theme />

      {/* Include Icons and manifest */}
      <Head>
        {/* Enable View Transitions API */}
        <meta name="view-transition" content="same-origin" />

        {/* Tailwind v3 CSS file */}
        <link
          href={asset(`/styles.css?revision=${revision}`)}
          rel="stylesheet"
        />
      </Head>

      <GlobalTags />
      {/* Add Tag Manager script during production only. To test it locally remove the condition */}
      {!!Context.active().deploymentId && trackingId && (
        <GoogleTagManager trackingId={trackingId} />
      )}
      {/* Rest of Preact tree */}
      <ctx.Component />

      {/* Include service worker */}
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: `(${sw})();` }}
      />
    </>
  );
});
