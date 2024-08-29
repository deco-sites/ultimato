import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";
import HQSelectorList, {
  type Selectors,
} from "deco-sites/ultimato/components/HQSelectorList.tsx";
import FeaturedPosts from "deco-sites/ultimato/components/BlogArchive/FeaturedPosts.tsx";

import { type BlogPost } from "deco-sites/ultimato/utils/transform.ts";

import type { AppContext } from "deco-sites/ultimato/apps/site.ts";

import type { SectionProps } from "deco/mod.ts";
export interface Props {
  /**
   * @title Selectores de HQ
   * @description Lista de seletores de HQ
   */
  selectors: Selectors[];
}

function Top5AndCat({ selectors, posts }: SectionProps<typeof loader>) {
  return (
    <div className="flex flex-wrap-reverse justify-between mb-32">
      <div className="w-full lg:pr-8 xl:w-3/4 xl:pr-10 xl:border-r xl:border-gray-200 2xl:w-2/3 2xl:pr-12">
        <SectionTitle tag="h2">
          TOP 5 DA SEMANA
        </SectionTitle>
        {posts && (
          <FeaturedPosts
            posts={posts.slice(0, 5)}
          />
        )}
      </div>
      <div className="grid mb-8 lg:flex-1 lg:block lg:pl-8 lg:mb-0 xl:pl-10 2xl:pl-12">
        <HQSelectorList selectors={selectors} />
      </div>
    </div>
  );
}

export const loader = async (
  { selectors }: Props,
  _req: Request,
  ctx: AppContext,
): Promise<{
  selectors: Selectors[];
  posts: BlogPost[];
}> => {
  const content = await ctx.invoke(
    "deco-sites/ultimato/loaders/post-archive.ts",
    {
      perPage: 30,
      orderBy: "date",
      order: "desc",
    },
  );

  return {
    selectors,
    posts: content.posts,
  };
};

export default Top5AndCat;
