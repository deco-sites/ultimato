import { Fragment } from "preact";

import DecoImage from "apps/website/components/Image.tsx";
import GenericCover from "deco-sites/ultimato/components/ui/GenericCover.tsx";

import { filterCategories } from "deco-sites/ultimato/utils/categories.tsx";

import {
  type BlogPost,
  type Category as CategoryType,
  type Page,
} from "deco-sites/ultimato/utils/transform.ts";

import type { DecoSinglePost } from "deco-sites/ultimato/loaders/single-post.ts";

export interface Props {
  postContent: DecoSinglePost;
}

function PostCover(
  { postContent: { singlePost, page, contentTypeName } }: Props,
) {
  if (!singlePost && !page) return <GenericCover title="Erro 404" />;

  if (contentTypeName === "page") {
    const { title } = page as Page;

    return <GenericCover title={title as string} />;
  }

  const { title, image, date, readingTime } = singlePost as BlogPost;

  const categories = singlePost?.categories as CategoryType[];

  return (
    <div class="relative w-full bg-black h-[290px] lg:h-[500px]">
      <div class="z-10 text-white flex flex-col justify-center items-center h-full relative max-w-screen-md mx-auto pt-8">
        <h1 class="font-extrabold mb-4 text-xl max-w-xs text-center lg:text-4xl lg:max-w-max">
          {title}
        </h1>
        <div class="text-center text-xs lg:text-sm">
          <div>
            {categories
              .filter((category) =>
                filterCategories(
                  category.slug,
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
            Em {date} {" • "} {`${readingTime} minutos de leitura`}
          </div>
        </div>
      </div>
      {image && image?.url && (
        <DecoImage
          src={image?.url}
          width={1800}
          alt={image?.alt}
          className="w-full h-full absolute z-0 object-center object-cover opacity-30 top-0 left-0"
          loading="eager"
        />
      )}
    </div>
  );
}

export default PostCover;
