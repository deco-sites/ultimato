import Slider from "../../islands/Slider.tsx";
import GenericCover from "deco-sites/ultimato/components/ui/GenericCover.tsx";

import loader from "deco-sites/ultimato/loaders/news-carousel.ts";

import type { SectionProps } from "deco/mod.ts";

function PostsSlider({ posts }: SectionProps<typeof loader>) {

  if (!posts || posts?.length === 0) return <GenericCover title="Erro 404" />;


  const sliderData = posts?.filter(({ id, title, slug, featuredImage }) =>
    id && title && slug && featuredImage
  )?.map((post) => {
    const imageUrl = post.featuredImage?.node?.sourceUrl || "";

    return {
      id: post.id,
      title: post.title as string,
      image: imageUrl,
      link: post.slug as string,
    };
  });

  return (
    <>
      {sliderData && sliderData.length > 0 && <Slider content={sliderData} />}
    </>
  );
}

export default PostsSlider;
export { loader };
