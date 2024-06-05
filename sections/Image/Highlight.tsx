import type { SectionProps } from "deco/mod.ts";
import DecoImage from "apps/website/components/Image.tsx";
import { replaceAllSites } from "deco-sites/ultimato/utils/url.ts";

import { AppContext } from "deco-sites/ultimato/apps/site.ts";

export interface Props {
  /** @title Esconder */
  hideComponent?: boolean;

  /** @title Posição */
  position?: "top" | "bottom" | "middle";
}

interface LoaderResponse extends Props {
  image: string;
  alt: string;
  link: {
    url: string;
    target: string;
  };
}

export const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<LoaderResponse> => {
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

  const postHome = await ctx.invoke(
    "deco-sites/ultimato/loaders/single-page.ts",
    {
      id: 5692,
    },
  );

  const banner = {
    link: {
      // @ts-ignore: acf can have any value
      url: postHome.page?.acf?.link?.url as string | undefined,
      // @ts-ignore: acf can have any value
      target: postHome.page?.acf?.link?.target as string | undefined,
    },
    image: {
      // @ts-ignore: acf can have any value
      url: postHome.page?.acf?.image?.url as string | undefined,
      // @ts-ignore: acf can have any value
      alt: postHome.page?.acf?.image?.alt as string | undefined,
    },
    hide: postHome.page?.acf?.hide as string | undefined,
  };

  response.image = banner.image?.url
    ? banner.image.url
    : response.image as string;

  response.alt = banner.image?.alt ? banner.image.alt : response.alt;

  response.link = {
    url: banner.link.url ? banner.link.url : response.link.url as string,
    target: banner.link.target
      ? banner.link.target
      : response.link.target as string,
  };

  return response;
};

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
