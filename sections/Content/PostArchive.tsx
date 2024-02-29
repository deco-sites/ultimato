import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";
import LatestPosts from "deco-sites/ultimato/components/BlogArchive/LatestPosts.tsx";
import Pagination from "deco-sites/ultimato/components/BlogArchive/Pagination.tsx";

import loader from "deco-sites/ultimato/loaders/post-archive.ts";
import type { SectionProps } from "deco/mod.ts";

function PostArchive(
  { posts, pageInfo, sidebar, category }: SectionProps<typeof loader>,
) {
  if (!posts || posts.length < 1) {
    return (
      <div className="text-gray-500 font-bold text-2xl text-center py-48">
        Não há posts nesta categoria.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap-reverse lg:flex-nowrap justify-between pb-24">
      <div className="w-full pr-0 lg:w-2/3 lg:pr-20 xl:pr-32">
        <SectionTitle tag="div">
          {category
            ? `Últimas postagens sobre "${category}"`
            : `Notícias, Matérias e Reviews`}
          {pageInfo.hasPrevious ? ` - Página ${pageInfo.pageNumber}` : ``}
        </SectionTitle>

        <LatestPosts
          posts={posts}
        />

        <Pagination context={pageInfo} pathPrefix="/" />
      </div>
      {sidebar &&
        (
          <aside className="flex-1 max-w-md bg-neutral rounded-lg px-6 py-6 hidden lg:block">
            <sidebar.Component {...sidebar.props} />
          </aside>
        )}
    </div>
  );
}

export default PostArchive;
export { loader };
