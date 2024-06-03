import type { BlogPost } from "deco-sites/ultimato/utils/transform.ts";
import { hasCategory } from "deco-sites/ultimato/utils/categories.tsx";

import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";

function FeaturedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <div></div>;
  }

  const weekPosts = posts
    .filter((post) => post)
    .filter((post) => !hasCategory(post, "porquinhos"))
    /** @ts-ignore */
    .sort((postA, postB) => {
      const postViewsA = postA?.views ? postA.views : 0;
      const postViewsB = postB?.views ? postB.views : 0;

      if (
        postViewsA > postViewsB
      ) {
        return -1;
      }
    });

  const heroPost = (weekPosts.length > 4 ? weekPosts[0] : posts[0]) as BlogPost;

  const otherPosts = weekPosts.length > 4
    ? weekPosts.slice(1, 5)
    : posts.slice(1, 5);

  return (
    <div className="flex flex-wrap">
      <div className="w-full mb-6 lg:w-1/2 lg:pr-6 lg:mb-0 xl:w-3/5 xl:pr-8">
        <Post
          title={heroPost?.title}
          slug={heroPost?.slug}
          image={heroPost?.image}
          readingTime={heroPost?.readingTime}
          excerpt={heroPost?.excerpt}
          categories={heroPost?.categories}
          date={heroPost?.date}
          layout="vertical-full"
        />
      </div>
      <div className="w-full lg:w-1/2 xl:w-2/5">
        {otherPosts &&
          otherPosts.map((
            { id, title, slug, image, date, readingTime, categories },
          ) => (
            <Post
              key={id}
              title={title}
              slug={slug}
              image={image}
              date={date}
              readingTime={readingTime}
              categories={categories}
              layout="horizontal-reduced"
            />
          ))}
      </div>
    </div>
  );
}

export default FeaturedPosts;
