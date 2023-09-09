import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";
import { hasCategory } from "deco-sites/ultimato/utils/categories.tsx";

import type {
  Category,
  Post as PostType,
  RootQueryToPostConnectionEdge as PostEdge,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

function FeaturedPosts({ posts }: { posts: PostEdge[] }) {
  if (posts.length === 0) {
    return <div></div>;
  }

  const today = new Date();
  const lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7,
  );

  const weekPosts = posts
    .filter((post) => post && post.node && post.node.date)
    .filter(({ node }) => node && new Date(node.date as string) > lastWeek)
    .filter(({ node }) => !hasCategory(node, "porquinhos"))
    /** @ts-ignore */
    .sort((postA, postB) => {
      const postViewsA = postA?.node?.acfPostParams?.postviews
        ? postA.node.acfPostParams.postviews
        : 0;
      const postViewsB = postB?.node?.acfPostParams?.postviews
        ? postB.node.acfPostParams.postviews
        : 0;

      if (
        postViewsA > postViewsB
      ) {
        return -1;
      }
    });

  const heroPost =
    (weekPosts.length > 4 ? weekPosts[0].node : posts[0].node) as PostType;

  const otherPosts = weekPosts.length > 4
    ? weekPosts.slice(1, 5)
    : posts.slice(1, 5);

  return (
    <div className="flex flex-wrap">
      <div className="w-full mb-6 lg:w-1/2 lg:pr-6 lg:mb-0 xl:w-3/5 xl:pr-8">
        <Post
          title={heroPost?.title}
          slug={heroPost?.slug}
          image={heroPost?.featuredImage ? heroPost?.featuredImage?.node : null}
          readingTime={heroPost?.readingTime}
          excerpt={heroPost?.excerpt}
          categories={(heroPost?.categories
            ?.nodes as Category[]).filter(
              (c) => c,
            )}
          date={heroPost?.date}
          layout="vertical-full"
        />
      </div>
      <div className="w-full lg:w-1/2 xl:w-2/5">
        {otherPosts &&
          otherPosts.map(({ node }) => (
            <Post
              key={node?.id}
              title={node?.title}
              slug={node?.slug}
              image={node?.featuredImage ? node.featuredImage.node : null}
              date={node?.date}
              readingTime={node?.readingTime}
              categories={(node?.categories
                ?.nodes as Category[]).filter(
                  (c) => c,
                )}
              layout="horizontal-reduced"
            />
          ))}
      </div>
    </div>
  );
}

export default FeaturedPosts;
