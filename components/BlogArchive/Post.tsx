import PostHorizontal from "deco-sites/ultimato/components/BlogArchive/PostHorizontal.tsx";
import PostVertical from "deco-sites/ultimato/components/BlogArchive/PostVertical.tsx";

import type { BlogPost } from "deco-sites/ultimato/utils/transform.ts";

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface Props extends
  MakeOptional<
    Omit<BlogPost, "id" | "content">,
    "categories" | "excerpt" | "views"
  > {
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

function Post({
  title,
  slug,
  readingTime,
  image,
  excerpt,
  date,
  categories,
  layout,
  colorScheme = "light",
}: Props) {
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
}

export default Post;
