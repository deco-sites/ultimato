import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";
import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";

import type {
  DecoPostArchive,
} from "deco-sites/ultimato/loaders/post-archive.ts";

import FlyingBacons from "deco-sites/ultimato/islands/FlyingBacons.tsx";

/** @title {{{name}}} */
export interface CategoryGroup {
  name: string;
  queryPosts: DecoPostArchive;
}

/**
 * @title Get Posts by Category
 * @description Select 3 categories and display their posts.
 */

export interface Props {
  categoryGroups: CategoryGroup[];
}

function Categories({
  categoryGroups,
}: Props) {
  return (
    <div className="container-wrapper bg-dark group/container-dark">
      <FlyingBacons bg="dark" />
      <div className="container px-4 bacon-background">
        <div className="flex flex-wrap justify-between py-28 border-b border-gray-600">
          {categoryGroups &&
            categoryGroups.map((item) => (
              <div
                className="w-full mb-24 lg:w-1/3 lg:pr-4 lg:mb-0 xl:px-8"
                key={item.name}
              >
                <SectionTitle variation="dark" tag="div">
                  {item.name}
                </SectionTitle>

                {item.queryPosts.posts
                  .map((
                    {
                      id,
                      title,
                      slug,
                      image,
                      date,
                      readingTime,
                    },
                  ) => (
                    <div key={id} className="mb-12 last:mb-0">
                      <Post
                        title={title}
                        slug={slug}
                        image={image}
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
      </div>
    </div>
  );
}

export default Categories;
