import HQSelectorList from "deco-sites/ultimato/components/HQSelectorList.tsx";
import FeaturedPosts from "deco-sites/ultimato/components/BlogArchive/FeaturedPosts.tsx";

import type { SectionProps } from "deco/mod.ts";

import type {
  RootQueryToPostConnectionEdge,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import loader from "deco-sites/ultimato/loaders/top5week.ts";

function Top5AndCat({ selectors, posts }: SectionProps<typeof loader>) {
  return (
    <div className="flex flex-wrap-reverse justify-between">
      <div className="w-full lg:pr-8 xl:w-3/4 xl:pr-10 xl:border-r xl:border-gray-200 2xl:w-2/3 2xl:pr-12">
        {posts && posts.featured && posts.featured.edges && (
          <FeaturedPosts
            posts={posts.featured.edges as RootQueryToPostConnectionEdge[]}
          />
        )}
      </div>
      <div className="grid mb-8 lg:flex-1 lg:block lg:pl-8 lg:mb-0 xl:pl-10 2xl:pl-12">
        <HQSelectorList selectors={selectors} />
      </div>
    </div>
  );
}

export default Top5AndCat;
export { loader };
