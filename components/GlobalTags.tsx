import { asset, Head } from "$fresh/runtime.ts";

function GlobalTags() {
  return (
    <Head>
      {/* Tailwind v3 CSS file */}
      <link href={asset("/styles.css")} rel="stylesheet" />

      {/* Icons */}
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={asset("/favicon-32x32.png")}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={asset("/favicon-16x16.png")}
      />
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href={asset("/favicon-32x32.png")}
      />

      {/* Web Manifest */}
      <link rel="manifest" href={asset("/site.webmanifest")} />

      {/* Fonts */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Montserrat';
              src:
                local('Montserrat Bold'), 
                local('Montserrat-Bold'),
                url(${asset("/fonts/Montserrat-Bold.woff2")}) format('woff2'),
              font-weight: bold;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Montserrat';
              src:
                local('Montserrat ExtraLight'), 
                local('Montserrat-ExtraLight'),
                url(${
            asset("/fonts/Montserrat-ExtraLight.woff2")
          }) format('woff2'),
              font-weight: 200;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Montserrat';
              src:
                local('Montserrat ExtraBold'), 
                local('Montserrat-ExtraBold'),
                url(${
            asset("/fonts/Montserrat-ExtraBold.woff2")
          }) format('woff2'),
              font-weight: 800;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Montserrat';
              src:
                local('Montserrat SemiBold'), 
                local('Montserrat-SemiBold'),
                url(${
            asset("/fonts/Montserrat-SemiBold.woff2")
          }) format('woff2'),
              font-weight: 600;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Montserrat';
              src:
                local('Montserrat Regular'), 
                local('Montserrat-Regular'),
                url(${
            asset("/fonts/Montserrat-Regular.woff2")
          }) format('woff2'),
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Montserrat';
              src:
                local('Montserrat Medium'), 
                local('Montserrat-Medium'),
                url(${asset("/fonts/Montserrat-Medium.woff2")}) format('woff2'),
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Montserrat';
              src:
                local('Montserrat Light'), 
                local('Montserrat-Light'),
                url(${asset("/fonts/Montserrat-Light.woff2")}) format('woff2'),
              font-weight: 300;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Montserrat';
              src:
                local('Montserrat Thin'), 
                local('Montserrat-Thin'),
                url(${asset("/fonts/Montserrat-Thin.woff2")}) format('woff2'),
              font-weight: 100;
              font-style: normal;
              font-display: swap;
            }
            `,
        }}
      >
      </style>
    </Head>
  );
}

export default GlobalTags;
