import type { DecoSinglePost } from "deco-sites/ultimato/loaders/single-post.ts";
import DecoImage from "apps/website/components/Image.tsx";

import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";

export interface Props {
  postContent: DecoSinglePost;
}

export default function RelatedPosts(
  { postContent: { relatedPosts, contentTypeName } }: Props,
) {
  if (!relatedPosts || !contentTypeName) {
    return <></>;
  }

  return (
    <>
      <SectionTitle tag="h3">Notícias relacionadas</SectionTitle>
      <div class="flex justify-between flex-wrap flex-col md:flex-row mb-20">
        {relatedPosts &&
          relatedPosts.map(
            ({ slug, title, image, date, readingTime }) => (
              <div
                key={slug}
                class="w-full flex flex-wrap justify-between flex-row-reverse gap-4 mb-8 md:flex-col md:w-1/4 md:mb-0 md:gap-0 lg:w-1/4"
              >
                {image &&
                  image?.url &&
                  (
                    <a href={`/${slug}`}>
                      <div
                        class="rounded-lg overflow-hidden w-24 h-24 sm:w-32 sm:h-32 md:w-full md:h-32 md:flex md:mb-4 lg:h-48"
                        title={title}
                      >
                        <DecoImage
                          src={image?.url as string}
                          width={300}
                          height={192}
                          class="object-cover object-center w-full h-full"
                          alt={image?.alt as string}
                        />
                      </div>
                    </a>
                  )}
                <div class="flex-1">
                  <h4 class="font-bold text-sm mb-2 lg:text-xl">
                    <a href={`/${slug}`}>{title}</a>
                  </h4>
                  <p class="text-xs text-gray-400">
                    {date} • {readingTime} minutos de leitura
                  </p>
                </div>
              </div>
            ),
          )}
      </div>
    </>
  );
}
