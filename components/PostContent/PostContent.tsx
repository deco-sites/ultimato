import type { SectionProps } from "deco/mod.ts";

import loader from "deco-sites/ultimato/loaders/single-post.ts";

export default function PostContent(
  { singlePost, page, contentTypeName }: SectionProps<typeof loader>,
) {
  const content = contentTypeName === 'page' ? page?.content as string : singlePost?.content as string;

  return (
    <article class={`prose prose-sm prose-gray mx-auto mb-16 ${contentTypeName === 'page' ? 'lg:prose-lg max-w-5xl' : 'lg:prose'}`}>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </article>
  );
}
