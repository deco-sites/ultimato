import { useEffect, useId } from "preact/hooks";

import {
  register,
} from "https://esm.sh/swiper@10.3.1/element/bundle?target=es2022";

interface Props {
  posts: {
    id: string;
    slug: string;
    title: string;
    image?: string;
    alt?: string;
  }[];
}

function PigsSlider({ posts }: Props) {
  const idController = useId();
  const idThumbs = useId();

  useEffect(() => {
    register();

    const swiperThumbs: Element & { initialize: () => void } | null = document
      .querySelector(`swiper-container#${idThumbs}`);

    const thumbsProps = {
      spaceBetween: 24,
      slidesPerView: 2.6,
      centerInsufficientSlides: true,
      centeredSlides: true,
      centeredSlidesBounds: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      freeMode: true,
      breakpoints: {
        320: { slidesPerView: 3.8 },
        400: { slidesPerView: 4.6 },
        600: { slidesPerView: 5.6 },
        800: { slidesPerView: 9 },
      },
    };

    if (swiperThumbs) {
      Object.assign(swiperThumbs, thumbsProps);

      swiperThumbs.initialize();
    }
  }, []);

  return (
    <>
      <swiper-container
        id={idController}
        space-between="0"
        slides-per-view="1"
        thumbs-swiper=".pigs-thumbs"
        autoplay={`{"delay":4000}`}
        loop="true"
        style="transform:translate3d(0,10%,0);"
      >
        {posts.map(({ id, slug, title, image, alt }) => {
          return (
            <swiper-slide key={id}>
              <a
                className="flex flex-wrap gap-8 justify-center items-center max-w-xl m-auto lg:h-80 lg:flex-nowrap"
                href={`/${slug}`}
              >
                {image && (
                  <div className="h-48 lg:h-auto lg:w-56 relative">
                    <img
                      className="h-48 lg:h-auto object-contain mx-auto w-auto lg:w-full"
                      src={image}
                      alt={alt ?? title}
                    />
                  </div>
                )}
                <p
                  className="text-white text-sm lg:text-xl [&>span]:block [&>span]pl-6 [&>span]font-bold [&>span]text-lg [&>span]lg:text-4xl"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              </a>
            </swiper-slide>
          );
        })}
      </swiper-container>

      <div className="max-w-3xl mx-auto transform-gpu translate-y-1/3">
        <swiper-container
          id={idThumbs}
          class="pigs-thumbs"
          init="false"
        >
          {posts.map(({ id, image, alt, title }) => {
            return (
              <swiper-slide key={id} className="pt-8">
                <div className="thumb-decorator relative bg-white border-2 border-transparent flex justify-center items-center w-20 h-20 rounded-lg transition-all duration-200 cursor-pointer p-[6px]">
                  {image && (
                    <div className="relative w-full h-full flex justify-center items-center">
                      <img
                        className="object-contain object-center w-full h-full aspect-square"
                        type="min"
                        src={image}
                        alt={alt ?? title}
                      />
                    </div>
                  )}
                </div>
              </swiper-slide>
            );
          })}
        </swiper-container>
      </div>
    </>
  );
}

export default PigsSlider;
