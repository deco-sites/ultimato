import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";
import LatestPosts from "deco-sites/ultimato/components/BlogArchive/LatestPosts.tsx";
import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";
import Pagination from "deco-sites/ultimato/components/BlogArchive/Pagination.tsx";

import Page404 from "deco-sites/ultimato/components/ui/404.tsx";

import Seo from "deco-sites/ultimato/components/Seo.tsx";

import type {
  Category,
  PostTypeSeo,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import loader from "deco-sites/ultimato/loaders/post-archive.ts";
import type { SectionProps } from "deco/mod.ts";

function PostArchive(
  {
    posts,
    pageInfo,
    sidebar,
    category,
    colorScheme,
    showFeatured,
    callToAction,
    home,
  }: SectionProps<typeof loader>,
) {
  if (!posts || posts.length < 1) {
    return <Page404 />;
  }

  return (
    <>
      {(category && category.name)
        ? (
          <Seo
            seo={category?.seo as PostTypeSeo}
            type="archive"
            archiveTitle={category.name}
          />
        )
        : <Seo seo={home?.seo as PostTypeSeo} type="home" />}
      <div className="flex flex-wrap-reverse lg:flex-nowrap justify-between pb-24">
        <div className="w-full pr-0 lg:w-2/3 lg:pr-20 xl:pr-32">
          <SectionTitle tag="div">
            {(category && category.name)
              ? `Últimas postagens sobre "${category.name}"`
              : `Notícias, Matérias e Reviews`}
            {pageInfo.hasPrevious ? ` - Página ${pageInfo.pageNumber}` : ``}
          </SectionTitle>

          {showFeatured
            ? (
              <>
                <Post
                  key={posts[0].id}
                  title={posts[0].title}
                  slug={posts[0].slug}
                  image={posts[0].featuredImage
                    ? posts[0].featuredImage.node
                    : null}
                  date={posts[0].date}
                  readingTime={posts[0].readingTime}
                  excerpt={posts[0].excerpt}
                  colorScheme={colorScheme}
                  categories={posts[0].categories
                    ? posts[0].categories.nodes as Category[]
                    : undefined}
                  layout="vertical-full"
                />

                {callToAction && (
                  <callToAction.Component {...callToAction.props} />
                )}

                <LatestPosts
                  posts={posts.slice(1)}
                  colorScheme={colorScheme}
                />
              </>
            )
            : (
              <>
                {callToAction && (
                  <callToAction.Component {...callToAction.props} />
                )}
                <LatestPosts
                  posts={posts}
                  colorScheme={colorScheme}
                />
              </>
            )}

          <Pagination context={pageInfo} pathPrefix={pageInfo.pathPrefix} />
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
    </>
  );
}

export default PostArchive;
export { loader };
