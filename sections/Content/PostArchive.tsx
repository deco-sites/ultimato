import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";
import LatestPosts from "deco-sites/ultimato/components/BlogArchive/LatestPosts.tsx";
import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";
import Pagination from "deco-sites/ultimato/components/BlogArchive/Pagination.tsx";
import Page404 from "deco-sites/ultimato/components/ui/404.tsx";
import type { DecoPostArchive } from "deco-sites/ultimato/loaders/post-archive.ts";
import FlyingBacons from "deco-sites/ultimato/islands/FlyingBacons.tsx";
import { type Section } from "@deco/deco/blocks";
export interface Props {
  postsContent: DecoPostArchive;
  sidebar?: Section;
  colorScheme?: "dark" | "light";
  showFeatured?: boolean;
  callToAction?: Section;
  categoryName?: string;
  paginationPrefix?: string;
}
function PostArchive(
  { postsContent, sidebar, colorScheme = "light", showFeatured, callToAction }:
    Props,
) {
  const pageInfo = postsContent.pageContext;
  if (pageInfo.status === 404) {
    return <Page404 />;
  }
  return (
    <div
      className={`container-wrapper ${
        colorScheme === "light"
          ? "bg-white group/container-light"
          : "bg-dark group/container-dark"
      }`}
    >
      <FlyingBacons bg={colorScheme} />
      <div className="container px-4 bacon-background">
        <div className="flex flex-wrap-reverse lg:flex-nowrap justify-between pb-24">
          <div className="w-full pr-0 lg:w-2/3 lg:pr-20 xl:pr-32">
            <SectionTitle
              tag={(postsContent.query?.isHQ ||
                  postsContent.query?.isCategory ||
                  postsContent.pageContext.page > 1)
                ? "h1"
                : "h2"}
            >
              {postsContent.query.categoryName
                ? `Últimas postagens sobre "${postsContent.query.categoryName}"`
                : `Notícias, Matérias e Reviews`}
              {(pageInfo.page > 1) ? ` - Página ${pageInfo.page}` : ``}
            </SectionTitle>

            {showFeatured
              ? (
                <>
                  <Post
                    key={postsContent.posts[0].id}
                    title={postsContent.posts[0].title}
                    slug={postsContent.posts[0].slug}
                    image={postsContent.posts[0].image}
                    date={postsContent.posts[0].date}
                    readingTime={postsContent.posts[0].readingTime}
                    excerpt={postsContent.posts[0].excerpt}
                    colorScheme={colorScheme}
                    categories={postsContent.posts[0].categories}
                    layout="vertical-full"
                  />

                  {callToAction && (
                    <callToAction.Component {...callToAction.props} />
                  )}

                  {
                    <LatestPosts
                      posts={postsContent.posts.slice(1)}
                      colorScheme={colorScheme}
                    />
                  }
                </>
              )
              : (
                <>
                  {callToAction && (
                    <callToAction.Component {...callToAction.props} />
                  )}
                  {
                    <LatestPosts
                      posts={postsContent.posts}
                      colorScheme={colorScheme}
                    />
                  }
                </>
              )}

            <Pagination
              context={postsContent.pageContext}
              pathPrefix={postsContent.pageContext.paginationPrefix}
            />
          </div>
          {sidebar &&
            (
              <aside
                className={`flex-1 max-w-md rounded-lg px-6 py-6 hidden lg:block ${
                  colorScheme === "light" ? "bg-neutral" : ""
                }`}
              >
                <sidebar.Component {...sidebar.props} />
              </aside>
            )}
        </div>
      </div>
    </div>
  );
}
export default PostArchive;
