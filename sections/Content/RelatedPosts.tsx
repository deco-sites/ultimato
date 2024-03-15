import DecoImage from "apps/website/components/Image.tsx";
import loader from "deco-sites/ultimato/loaders/single-post.ts";

import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";

import { formatDate, stripTags } from "deco-sites/ultimato/utils/content.tsx";

import type { SectionProps } from "deco/mod.ts";

export default function RelatedPosts(
  { relatedPosts, contentTypeName }: SectionProps<typeof loader>,
) {

  if(!relatedPosts || !contentTypeName) {
    return <></>;
  }

  return (
    <>
      <SectionTitle tag="h3">Notícias relacionadas</SectionTitle>
      <div class="flex justify-between flex-wrap flex-col md:flex-row mb-20">
        {relatedPosts &&
          relatedPosts.map(
            ({ slug, title, featuredImage, date, readingTime } ) => (
              <div
                key={slug}
                class="w-full flex flex-wrap justify-between flex-row-reverse gap-4 mb-8 md:flex-col md:w-1/4 md:mb-0 md:gap-0 lg:w-1/4"
              >
                {featuredImage &&
                  featuredImage?.node?.sourceUrl &&
                  (
                    <a href={`/${slug}`}>
                      <div class="rounded-lg overflow-hidden w-24 h-24 sm:w-32 sm:h-32 md:w-full md:h-32 md:flex md:mb-4 lg:h-48" title={stripTags(title as string)}>
                        <DecoImage
                          src={featuredImage?.node?.sourceUrl as string}
                          width={300}
                          height={192}
                          class="object-cover object-center w-full h-full"
                          alt={featuredImage?.node?.altText as string}
                        />
                      </div>
                    </a>
                  )}
                <div class="flex-1">
                  <h4 class="font-bold text-sm mb-2 lg:text-xl">
                    <a href={`/${slug}`}>{stripTags(title as string)}</a>
                  </h4>
                  <p class="text-xs text-gray-400">
                    {formatDate(date as string)} {' • '} {readingTime}
                  </p>
                </div>
              </div>
            )
          )}
      </div>
    </>
  );
}

export { loader };
