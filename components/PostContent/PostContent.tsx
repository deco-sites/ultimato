import type { SectionProps } from "deco/mod.ts";

import loader from "deco-sites/ultimato/loaders/single-post.ts";

export default function PostContent(
  { singlePost }: SectionProps<typeof loader>,
) {
  const content = singlePost?.content as string;

  return (
    <article class="prose prose-sm prose-gray lg:prose mx-auto">
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </article>
  );
}
