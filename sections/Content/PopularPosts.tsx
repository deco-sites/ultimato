import { Fragment } from "preact";
import Post from "deco-sites/ultimato/components/BlogArchive/Post.tsx";
import Ad from "deco-sites/ultimato/components/Ad.tsx";

import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";

import type {
  DecoPostArchive,
} from "deco-sites/ultimato/loaders/post-archive.ts";

export interface Props {
  content?: DecoPostArchive
  adPosition?: "alternating" | "end";
  colorScheme?: "dark" | "light";
}


function PopularPosts({
  content,
  adPosition,
  colorScheme = "light",
}: Props) {
  return (
    <div>
      <SectionTitle tag="div">
        As Populares
      </SectionTitle>
      {content &&
        content.posts.map((
          { id, title, slug, image, date, readingTime, categories },
          index,
        ) => (
          <Fragment key={id}>
            <Post
              title={title}
              slug={slug}
              image={image}
              date={date}
              readingTime={readingTime}
              colorScheme={colorScheme}
              categories={categories}
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
