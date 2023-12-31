import { AppProps } from "$fresh/server.ts";
import { context } from "deco/live.ts";
import GoogleTagManager from "partytown/integrations/GTM.tsx";
import GlobalTags from "deco-sites/ultimato/components/GlobalTags.tsx";
import Theme from "deco-sites/ultimato/sections/Theme.tsx";

const trackingId = "";

export default function App(props: AppProps) {
  return (
    <>
      {/* Include default fonts and css vars */}
      <Theme />

      <GlobalTags />
      {/* Add Tag Manager script during production only. To test it locally remove the condition */}
      {!!context.deploymentId && trackingId && (
        <GoogleTagManager trackingId={trackingId} />
      )}
      <props.Component />
    </>
  );
}
