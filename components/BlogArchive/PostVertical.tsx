import {
  categoryURI,
  filterCategories,
} from "deco-sites/ultimato/utils/categories.tsx";

import {
  formatDate,
  formatExcerpt,
  stripTags,
} from "deco-sites/ultimato/utils/content.tsx";

import { Fragment } from "preact";

import { PostProps } from "deco-sites/ultimato/components/BlogArchive/Post.tsx";

import type { Category } from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

type Modify<T, R> = Omit<T, keyof R> & R;

type PostVerticalProps = Modify<
  PostProps,
  { layout: "reduced" | "full" | "medium"; categories?: Category[] }
>;

const PostVertical = (
  {
    title,
    slug,
    readingTime,
    image,
    excerpt,
    date,
    categories,
    layout,
    colorScheme,
  }: PostVerticalProps,
) => {
  return (
    <div
      className={`last-of-type:mb-0 ${
        layout === "reduced" ? "flex gap-4 flex-row-reverse lg:block" : ""
      } ${layout === "full" ? "mb-12" : ""}`}
    >
      {image && image.sourceUrl && (
        <div className="rounded-lg overflow-hidden flex cursor-pointer relative mb-4">
          <a href={`/${slug}`}>
            <img
              src={image?.sourceUrl}
              type={layout === "reduced" ? "mid" : "large"}
              alt={image?.altText || ""}
              className="w-full h-full object-center object-cover"
            />
          </a>
        </div>
      )}

      <div className="flex-1">
        {categories && (
          <div className="text-xs text-secondary mb-2">
            {categories
              .filter(({ slug, ancestors }) =>
                filterCategories(
                  categoryURI(slug as string, ancestors),
                )
              )
              .map((category, index, arr) => (
                <Fragment key={index}>
                  <a href={`/categoria/${category.slug}`}>
                    <span>{category.name}</span>
                  </a>
                  {arr.length > index + 1 && ", "}
                </Fragment>
              ))}
          </div>
        )}

        <a href={`/${slug}`}>
          <div>
            <h3
              className={`${layout === "full" ? "text-xl lg:text-2xl" : ""} ${
                colorScheme && colorScheme === "dark"
                  ? "text-white font-bold mb-2"
                  : "text-gray-800 font-bold mb-2"
              }`}
            >
              {stripTags(title as string)}
            </h3>
          </div>
        </a>

        {excerpt && (
          <p
            className={`${layout === "full" ? "hidden md:block" : "hidden"} ${
              colorScheme && colorScheme === "dark"
                ? "text-sm text-gray-300 mb-4"
                : "text-sm text-gray-600 mb-4"
            }`}
          >
            {formatExcerpt(excerpt, 200)}
          </p>
        )}

        <div className="text-xs text-gray-400">
          {formatDate(date as string)}

          {readingTime && (
            <span>
              {" • "}
              {`${readingTime} minutos de leitura`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostVertical;
