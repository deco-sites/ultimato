import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";

import type { BlogPost } from "deco-sites/ultimato/utils/transform.ts";
interface Props {
  posts: BlogPost[];
  colorScheme?: "dark" | "light";
}

function LatestPosts({ posts, colorScheme = "light" }: Props) {
  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        {posts &&
          posts.map((
            {
              id,
              title,
              slug,
              image,
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
              image={image}
              date={date}
              readingTime={readingTime}
              excerpt={excerpt}
              colorScheme={colorScheme}
              categories={categories}
              layout="horizontal-full"
            />
          ))}
      </div>
    </div>
  );
}

export default LatestPosts;
