import { Head } from "$fresh/runtime.ts";
import { replaceAllSites } from "deco-sites/ultimato/utils/url.ts";

import type {PostTypeSeo} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

interface Props {
  seo: PostTypeSeo;
  type?: "post" | "page" | "archive" | "home";
}

function Seo({ seo, type } : Props) {

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
    schema
  } = seo;

  const robots = `${metaRobotsNofollow},${metaRobotsNoindex}`;

  function formatSchema(schema: string) {
    const schemaReplace = schema.replace('admin.ultimatodobacon.com', 'ultimatodobacon.com')

    return JSON.parse(schemaReplace);
  }

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={`https://ultimatodobacon.com${replaceAllSites(canonical as string)}`} />
      <meta name="description" content={metaDesc as string} />
      <meta name="keywords" content={metaKeywords as string} />
      <meta name="robots" content={robots} />

      <meta property="og:title" content={opengraphTitle as string} />
      <meta property="og:description" content={opengraphDescription as string} />
      <meta property="og:url" content={replaceAllSites(opengraphUrl as string)} />
      <meta property="og:type" content={opengraphType as string} />
      <meta property="og:site_name" content={opengraphSiteName as string} />
      <meta property="og:published_time" content={opengraphPublishedTime as string} />
      <meta property="og:modified_time" content={opengraphModifiedTime as string} />
      <meta property="og:author" content={opengraphAuthor as string} />
      <meta property="og:publisher" content={opengraphPublisher as string} />
      <meta property="og:image" content={opengraphImage?.sourceUrl as string} />

      <meta name="twitter:title" content={twitterTitle as string} />
      <meta name="twitter:description" content={twitterDescription as string} />
      <meta name="twitter:image" content={twitterImage?.sourceUrl as string} />

      <script type="application/ld+json">
        {JSON.stringify(formatSchema(schema?.raw as string))}
      </script>

    </Head>
  );
}

export default Seo;
