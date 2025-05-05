import Page404 from "deco-sites/ultimato/components/ui/404.tsx";
/* import Seo from "deco-sites/ultimato/components/Seo.tsx";
 */
import type { DecoSinglePost } from "deco-sites/ultimato/loaders/single-post.ts";
import { parseHtml } from "deco-sites/ultimato/components/Blocks/parseBlocks.tsx";

export interface Props {
  postContent: DecoSinglePost;
}

export default function PostContent({
  postContent: { contentTypeName, singlePost, page },
}: Props) {
  if (!contentTypeName || (!singlePost && !page)) {
    return <Page404 />;
  }

  const content = contentTypeName === "page"
    ? page?.content as string
    : singlePost?.content as string;

  const html = parseHtml(content);

  /*   const seo = contentTypeName === "page"
    ? page?.seo as PostTypeSeo
    : singlePost?.seo as PostTypeSeo;
 */
  return (
    <>
      {
        /*  <Seo
        seo={seo}
        type={contentTypeName as "post" | "page" | "archive" | "home"}
      /> */
      }
      <article
        class={`prose prose-sm prose-gray mx-auto mb-16 ${
          contentTypeName === "page" ? "lg:prose-lg max-w-5xl" : "lg:prose"
        }`}
      >
        <div>
          {html}
        </div>
      </article>
    </>
  );
}
