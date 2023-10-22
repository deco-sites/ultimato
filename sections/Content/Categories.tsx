import { Fragment } from "preact";
import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";
import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";

import loader from "deco-sites/ultimato/loaders/categories.ts";

import type {
  Category,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import type { SectionProps } from "deco/mod.ts";

function Categories({
  categories,
}: SectionProps<typeof loader>) {
  return (
    <div className="flex flex-wrap justify-between py-28 border-b border-gray-600">
      {categories &&
        categories.map((item, index) => (
          <div className="w-full mb-24 lg:w-1/3 lg:pr-4 lg:mb-0 xl:px-8">
            <SectionTitle variation="dark" tag="div">
              {item.name}
            </SectionTitle>

            {item.posts &&
              item.posts.map((
                {
                  id,
                  title,
                  slug,
                  featuredImage,
                  date,
                  readingTime,
                  categories,
                },
                index,
              ) => (
                <div key={id} className="mb-12 last:mb-0">
                  <Post
                    title={title}
                    slug={slug}
                    image={featuredImage ? featuredImage.node : null}
                    date={date}
                    readingTime={readingTime}
                    layout="vertical-reduced"
                    colorScheme="dark"
                  />
                </div>
              ))}
          </div>
        ))}
    </div>
  );
}

export default Categories;
export { loader };
