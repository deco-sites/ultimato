import type { SectionProps } from "deco/mod.ts";
import DecoImage from "apps/website/components/Image.tsx";
import { replaceAllSites } from "deco-sites/ultimato/utils/url.ts";

import { FnContext } from "deco/types.ts";

import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type { Page } from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  FeaturedImageFields,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

export interface Props {
  hideComponent?: boolean;
  position?: "top" | "bottom" | "middle";
}

export const loader = async (
  props: Props,
  _req: Request,
  ctx: FnContext,
): Promise<
  Props & {
    image: string;
    alt: string;
    link: {
      url: string;
      target: string;
    };
  }
> => {
  const response = {
    ...props,
    ...{
      image: "",
      alt: "Destaque",
      link: {
        url: "#",
        target: "_self",
      },
    },
  };

  const client = createClient({ endpoint });

  const banner = await client.query<{ page: Page }>(
    Query,
    {},
    "getBannerHighlight",
  );

  if (banner) {
    response.image = banner.page.pageHighlight?.image?.sourceUrl
      ? banner.page.pageHighlight?.image?.sourceUrl
      : response.image;
    response.alt = banner.page.pageHighlight?.image?.altText
      ? banner.page.pageHighlight?.image?.altText
      : response.alt;
    response.link = {
      url: banner.page.pageHighlight?.link?.url
        ? banner.page.pageHighlight?.link?.url
        : response.link?.url,
      target: banner.page.pageHighlight?.link?.target
        ? banner.page.pageHighlight?.link?.target
        : response.link?.target,
    };
    response.hideComponent =
      (banner.page.pageHighlight?.hide === "nao" && !props.hideComponent)
        ? false
        : true;
  }

  return response;
};

const Query = gql`
${FeaturedImageFields}
query getBannerHighlight {
  page(id: 5692, idType: DATABASE_ID){
    pageHighlight {
      hide
      image {
       ...FeaturedImageFields
      }
      link {
        target
        url
      }
    }
  }
}
`;

function FullBanner(
  { image, alt, link, hideComponent, position }: SectionProps<typeof loader>,
) {
  if (hideComponent || !image) {
    return <div className="mb-10"></div>;
  }

  return (
    <div className="container px-4">
      <div
        className={`mx-auto rounded-lg shadow-lg h-20 lg:h-36 relative z-10 overflow-hidden cursor-pointer ${
          position === "top"
            ? "transform-gpu -translate-y-1/2"
            : (position === "bottom"
              ? "transform-gpu translate-y-1/2"
              : "my-10")
        }`}
      >
        <a
          className="w-full h-full flex"
          href={link?.url ? replaceAllSites(link.url) : "#"}
          target={link?.target ? link.target : "_self"}
          aria-label={alt}
        >
          <DecoImage
            className="w-full h-full object-left object-cover mx-auto"
            src={image}
            width={1200}
            height={144}
            alt={alt ? alt : "Destaque"}
            loading="eager"
          />
          <div className="sr-only">
            {alt ? alt : "Destaque"}
          </div>
        </a>
      </div>
    </div>
  );
}

export default FullBanner;
