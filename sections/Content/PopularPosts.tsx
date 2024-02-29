import { Fragment } from "preact";
import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";
import Ad from "deco-sites/ultimato/components/Ad.tsx";

import loader from "deco-sites/ultimato/loaders/popular-posts.ts";

import type {
  Category,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import type { SectionProps } from "deco/mod.ts";
import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";

function PopularPosts({
  posts,
  adPosition,
}: SectionProps<typeof loader>) {
  return (
    <div>
       <SectionTitle tag="div">
        As Populares
      </SectionTitle>
      {posts &&
        posts.map((
          { id, title, slug, featuredImage, date, readingTime, categories },
          index,
        ) => (
          <Fragment key={id}>
            <Post
              title={title}
              slug={slug}
              image={featuredImage ? featuredImage.node : null}
              date={date}
              readingTime={readingTime}
              categories={categories
                ? categories.nodes as Category[]
                : undefined}
              layout="horizontal-reduced"
            />
            {(!adPosition || adPosition === "alternating") &&
              index !== 0 &&
              index % 2 === 0 && (
              <Ad slot="6039121821" responsive="true" format="auto" />
            )}
          </Fragment>
        ))}
      {adPosition && adPosition === "end" && (
        <Ad slot="6039121821" responsive="true" format="auto" />
      )}
    </div>
  );
}

export default PopularPosts;
export { loader };
