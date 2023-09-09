import PostHorizontal from "deco-sites/ultimato/components/BlogArchive/PostHorizontal.tsx";
import PostVertical from "deco-sites/ultimato/components/BlogArchive/PostVertical.tsx";

import type {
  Category,
  MediaItem,
  Post,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

export interface PostProps {
  title: Post["title"];
  slug: Post["slug"];
  readingTime: Post["readingTime"];
  categories?: Category[];
  image?: MediaItem | null;
  date: Post["date"];
  excerpt?: Post["excerpt"] | null;
  layout: layout;
  colorScheme?: "dark" | "light";
}

type layout =
  | "horizontal-full"
  | "horizontal-medium"
  | "horizontal-reduced"
  | "vertical-full"
  | "vertical-medium"
  | "vertical-reduced";

const Post: React.FC<PostProps> = ({
  title,
  slug,
  readingTime,
  image,
  excerpt,
  date,
  categories,
  layout,
  colorScheme,
}) => {
  const isFull = layout.includes("full");
  const isMedium = layout.includes("medium");

  const layoutType = isFull ? "full" : isMedium ? "medium" : "reduced";

  return (
    <>
      {layout.includes("horizontal") && (
        <PostHorizontal
          title={title}
          slug={slug}
          readingTime={readingTime}
          image={image}
          excerpt={excerpt}
          date={date}
          categories={categories}
          layout={layoutType}
          colorScheme={colorScheme}
        />
      )}

      {layout.includes("vertical") && (
        <PostVertical
          title={title}
          slug={slug}
          readingTime={readingTime}
          image={image}
          excerpt={excerpt}
          date={date}
          categories={categories}
          layout={layoutType}
          colorScheme={colorScheme}
        />
      )}
    </>
  );
};

export default Post;
