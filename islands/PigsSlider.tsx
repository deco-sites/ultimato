import { useEffect, useId, useRef } from "preact/hooks";

import {
  register,
  SwiperContainer,
} from "swiper";

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

  const SwiperControllerRef = useRef<SwiperContainer>(null);
  const SwiperThumbsRef = useRef<SwiperContainer>(null);

  useEffect(() => {
    register();

    console.log(register);

    if (SwiperControllerRef.current && SwiperThumbsRef.current) {
      SwiperControllerRef.current?.setAttribute(
        "thumbs-swiper",
        `#${idThumbs}`,
      );
    }

    /*   const swiperThumbs: Element & { initialize: () => void } | null = document
      .querySelector(`#${idThumbs}`);

      const swiperController: Element & { initialize: () => void } | null =
      document.querySelector(`#${idController}`);

    const thumbsProps = {
      spaceBetween: 24,
      slidesPerView: 2.6,
      centerInsufficientSlides: true,
      centeredSlides: true,
      centeredSlidesBounds: true,
      watchSlidesProgress: true,
      freeMode: true,
      breakpoints: {
        320: { slidesPerView: 3.8 },
        400: { slidesPerView: 4.6 },
        600: { slidesPerView: 5.6 },
        800: { slidesPerView: 8 },
      },
    };



    const controllerProps = {
      thumbs: {
        swiper: `#${idThumbs}`,
      },
      spaceBetween: 0,
      slidesPerView: 1,
      autoplay: { delay: 4000 },
      injectStyles: [
        `
          :host {
            transform: translate3d(0, 10%, 0);
          }
        `,
      ],
    };

    if (swiperController && swiperThumbs) {
      Object.assign(swiperController, controllerProps);
      Object.assign(swiperThumbs, thumbsProps);

      swiperController.initialize();
      swiperThumbs.initialize();
      console.log(Object.getOwnPropertyNames(swiperThumbs))
      console.log(swiperThumbs.swiper)
    } */
  }, []);

  return (
    <>
      <swiper-container
        id={idController}
        ref={SwiperControllerRef}
        thumbs-swiper={`#${idThumbs}`}
        space-between="24"
        slides-per-view="1"
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
          ref={SwiperThumbsRef}
          space-between="24"
          slides-per-view="2.6"
          center-insufficient-slides="true"
          centered-slides="true"
          centered-slides-bounds="true"
          watch-slides-progress="true"
          free-mode="true"
          breakpoints='{"320": {"slidesPerView": 3.8}, "400": {"slidesPerView": 4.6}, "600": {"slidesPerView": 5.6}, "800": {"slidesPerView": 8}}'
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
