import { Head } from "$fresh/runtime.ts";
import { replaceAllSites } from "deco-sites/ultimato/utils/url.ts";

import type { PostTypeSeo } from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

interface Props {
  seo: PostTypeSeo;
  type?: "post" | "page" | "archive" | "home";
  archiveTitle?: string;
}

function Seo({ seo, type, archiveTitle }: Props) {
  const {
    title,
    canonical,
    metaDesc,
    metaKeywords,
    metaRobotsNofollow,
    metaRobotsNoindex,
    opengraphAuthor,
    opengraphDescription,
    opengraphModifiedTime,
    opengraphPublishedTime,
    opengraphPublisher,
    opengraphSiteName,
    opengraphTitle,
    opengraphType,
    opengraphUrl,
    opengraphImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    schema,
  } = seo;

  const robots = `${metaRobotsNofollow},${metaRobotsNoindex}`;

  function formatSchema(schema: string) {
    const schemaReplace = schema.replace(
      "admin.ultimatodobacon.com",
      "ultimatodobacon.com",
    );

    return JSON.parse(schemaReplace);
  }

  const siteName = "Ultimato do Bacon";

  const definitiveTitle = type === "archive"
    ? `Últimas postagens sobre "${archiveTitle}" - ${siteName}`
    : title;

  return (
    <Head>
      <title>{definitiveTitle}</title>
      <link
        rel="canonical"
        href={`https://ultimatodobacon.com${
          replaceAllSites(canonical as string)
        }`}
      />
      <meta name="description" content={metaDesc as string} />
      {metaKeywords && (
        <meta
          name="keywords"
          content={metaKeywords as string}
        />
      )}
      {robots && <meta name="robots" content={robots} />}

      {opengraphTitle && (
        <meta property="og:title" content={opengraphTitle as string} />
      )}

      {opengraphDescription && (
        <meta
          property="og:description"
          content={opengraphDescription as string}
        />
      )}

      {opengraphUrl && (
        <meta
          property="og:url"
          content={replaceAllSites(opengraphUrl as string)}
        />
      )}

      {opengraphType && (
        <meta property="og:type" content={opengraphType as string} />
      )}

      {opengraphSiteName && (
        <meta property="og:site_name" content={opengraphSiteName as string} />
      )}

      {opengraphPublishedTime && (
        <meta
          property="og:published_time"
          content={opengraphPublishedTime as string}
        />
      )}

      {opengraphModifiedTime && (
        <meta
          property="og:modified_time"
          content={opengraphModifiedTime as string}
        />
      )}

      {opengraphAuthor && (
        <meta property="og:author" content={opengraphAuthor as string} />
      )}

      {opengraphPublisher && (
        <meta property="og:publisher" content={opengraphPublisher as string} />
      )}

      {opengraphImage && (
        <meta
          property="og:image"
          content={opengraphImage.sourceUrl as string}
        />
      )}

      {twitterTitle && (
        <meta name="twitter:title" content={twitterTitle as string} />
      )}

      {twitterDescription && (
        <meta
          name="twitter:description"
          content={twitterDescription as string}
        />
      )}

      {twitterImage && (
        <meta name="twitter:image" content={twitterImage.sourceUrl as string} />
      )}

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(formatSchema(schema.raw as string))}
        </script>
      )}
    </Head>
  );
}

export default Seo;
