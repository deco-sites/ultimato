import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";

import type {
  Category,
  Post as PostType,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

interface Props {
  posts: PostType[];
}

function LatestPosts({ posts }: Props) {
  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        {posts &&
          posts.map((
            {
              id,
              title,
              slug,
              featuredImage,
              readingTime,
              excerpt,
              date,
              categories,
            },
          ) => (
            <Post
              key={id}
              title={title}
              slug={slug}
              image={featuredImage ? featuredImage.node : null}
              date={date}
              readingTime={readingTime}
              excerpt={excerpt}
              categories={categories
                ? categories.nodes as Category[]
                : undefined}
              layout="horizontal-full"
            />
          ))}
      </div>
    </div>
  );
}

export default LatestPosts;
