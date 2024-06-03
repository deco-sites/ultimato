import DecoImage from "apps/website/components/Image.tsx";

import { Fragment } from "preact";

import { Props as PostProps } from "deco-sites/ultimato/components/BlogArchive/Post.tsx";

export interface Props extends Omit<PostProps, "layout"> {
  layout: "reduced" | "full" | "medium";
}

const PostVertical = ({
  title,
  slug,
  readingTime,
  image,
  excerpt,
  date,
  categories,
  layout,
  colorScheme,
}: Props) => {
  return (
    <div
      className={`last-of-type:mb-0 ${
        layout === "reduced" ? "flex gap-4 flex-row-reverse lg:block" : ""
      } ${layout === "full" ? "mb-12" : ""}`}
    >
      {image && image.url && (
        <div className="rounded-lg overflow-hidden flex cursor-pointer relative mb-4">
          <a href={`/${slug}`}>
            <DecoImage
              src={image.url}
              width={layout === "reduced" ? 300 : 600}
              alt={image.alt}
              className={`h-24 w-24 lg:w-full lg:h-full object-center object-cover`}
              loading="lazy"
            />
          </a>
        </div>
      )}

      <div className="flex-1">
        {categories && layout !== "reduced" && (
          <div className="text-xs text-secondary mb-2">
            {categories
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
              {title}
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
            {excerpt}
          </p>
        )}

        <div className="text-xs text-gray-400">
          {date}

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
