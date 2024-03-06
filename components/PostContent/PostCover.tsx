import { Fragment } from "preact";
import loader from "deco-sites/ultimato/loaders/single-post.ts";

import type { SectionProps } from "deco/mod.ts";
import DecoImage from "apps/website/components/Image.tsx";

import { asset } from "$fresh/runtime.ts";

import { stripTags } from "deco-sites/ultimato/utils/content.tsx";
import {
  categoryURI,
  filterCategories,
} from "deco-sites/ultimato/utils/categories.tsx";

import type {
  Category as CategoryType,
  Page as PageType,
  Post as PostType,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

function PostCover(
  { singlePost, page, contentTypeName }: SectionProps<typeof loader>,
) {
  if (!singlePost && !page) return <div></div>;

  if (contentTypeName === "page") {
    const { title } = page as PageType;

    return (
      <div class="relative w-full lg:h-[400px]">
        <div class="z-10 text-white flex flex-col justify-center items-center h-full relative max-w-screen-md mx-auto pt-8">
          <h1 class="max-w-sm lg:max-w-screen-md z-10 text-white font-bold text-2xl lg:text-5xl mx-auto text-center">
            {stripTags(title as string)}
          </h1>
        </div>
        <img
          src={asset("/images/page_pattern.png")}
          width={1800}
          alt={title as string}
          className="w-full h-full absolute z-0 object-center object-cover top-0 left-0"
          loading="eager"
        />
      </div>
    );
  }

  const { title, featuredImage, date, readingTime } = singlePost as PostType;

  const categories = singlePost?.categories?.nodes as CategoryType[];

  return (
    <div class="relative w-full bg-black h-[200px] lg:h-[500px]">
      <div class="z-10 text-white flex flex-col justify-center items-center h-full relative max-w-screen-md mx-auto pt-8">
        <h1 class="font-extrabold mb-4 text-xl max-w-xs text-center lg:text-4xl lg:max-w-max">
          {stripTags(title as string)}
        </h1>
        <div class="text-center text-xs lg:text-sm">
          <div>
            {categories
              .filter((category) =>
                filterCategories(
                  categoryURI(category.slug as string, category.ancestors),
                )
              )
              .map((category, index, arr) => (
                <Fragment key={index}>
                  <a href={`/categoria/${category.slug}`}>
                    {category.name}
                  </a>
                  {arr.length > index + 1 && ", "}
                </Fragment>
              ))}
          </div>
          <div>
            Em {new Date(date as string).toLocaleString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })} {" • "} {`${readingTime} minutos de leitura`}
          </div>
        </div>
      </div>
      {featuredImage && featuredImage?.node?.sourceUrl && (
        <DecoImage
          src={featuredImage?.node?.sourceUrl}
          width={1800}
          alt={featuredImage?.node?.altText || ""}
          className="w-full h-full absolute z-0 object-center object-cover opacity-30 top-0 left-0"
          loading="eager"
        />
      )}
    </div>
  );
}

export default PostCover;
