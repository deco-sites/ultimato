import { Ref, useEffect, useRef, useState } from "preact/hooks";
import DecoImage from "apps/website/components/Image.tsx";
import Icon from "deco-sites/ultimato/components/ui/Icon.tsx";

import {
  register,
  SwiperContainer,
  SwiperSlide,
} from "https://esm.sh/swiper@11.0.6/element/bundle?target=es2022";
import { ComponentChildren } from "preact";

type CustomElement<T> = Partial<
  T
>;

type CustomProps = {
  children?: ComponentChildren;
  ref: Ref<SwiperContainer>;
  key?: string;
  class?: string;
};

type Container = Omit<SwiperContainer, "children"> & CustomProps;

type Slide = Omit<SwiperSlide, "children"> & CustomProps;

type Kebab<T extends string, A extends string = ""> = T extends
  `${infer F}${infer R}`
  ? Kebab<R, `${A}${F extends Lowercase<F> ? "" : "-"}${Lowercase<F>}`>
  : A;

type KebabKeys<T> = { [K in keyof T as K extends string ? Kebab<K> : K]: T[K] };
type Stringfy<T> = {
  [K in keyof T]: K extends "ref" ? T[K]
    : K extends "children" ? T[K]
    : string;
};

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      ["swiper-container"]: CustomElement<KebabKeys<Stringfy<Container>>>;
      ["swiper-slide"]: CustomElement<Slide>;
    }
  }
}

export interface Props {
  content: SlideType[];
}

type SlideType = {
  id: string;
  title: string;
  image: string;
  link: string;
};

function Slider({ content }: Props) {
  const swiperElRef = useRef<SwiperContainer>(null);

  const [registered, setRegistered] = useState(false);

  function updatePrevAndNextTitles(
    ref: { current?: SwiperContainer | null },
  ) {
    if (ref.current) {
      const slides = ref.current.querySelectorAll("swiper-slide");

      const getSlide = (index: number) =>
        ref.current?.querySelector(`[data-swiper-slide-index="${index}"]`);

      const activeSlide = ref.current.querySelector(".swiper-slide-active") as
        | HTMLElement
        | null;

      const prevButton = ref.current.querySelector(
        ".prev-button-label",
      ) as HTMLElement;
      const nextButton = ref.current.querySelector(
        ".next-button-label",
      ) as HTMLElement;

      const activeSlideIndex = parseInt(
        activeSlide?.dataset.swiperSlideIndex as string,
        10,
      );
      const totaSlides = slides.length - 1;

      if (activeSlideIndex === 0) {
        prevButton.innerText = (getSlide(totaSlides) as HTMLElement).innerText;
      } else {
        prevButton.innerText =
          (getSlide(activeSlideIndex - 1) as HTMLElement).innerText;
      }

      if (activeSlideIndex === totaSlides) {
        nextButton.innerText = (getSlide(0) as HTMLElement).innerText;
      } else {
        nextButton.innerText =
          (getSlide(activeSlideIndex + 1) as HTMLElement).innerText;
      }
    }
  }

  useEffect(() => {
    register();
    setRegistered(true);

    if (swiperElRef.current) {
      setTimeout(() => {
        updatePrevAndNextTitles(swiperElRef);
      }, 100);

      swiperElRef.current.addEventListener("slidechange", (e) => {
        setTimeout(() => {
          updatePrevAndNextTitles(swiperElRef);
        }, 100);
      });
    }
  }, []);

  return (
    <div className="relative">
      <swiper-container
        ref={swiperElRef}
        slides-per-view="1"
        space-between="0"
        loop="true"
        autoplay={`{"delay":4000}`}
      >
        <div slot="container-end">
          <NavigationButton
            element={swiperElRef}
            direction="next"
          />
          <NavigationButton
            element={swiperElRef}
            direction="prev"
          />
        </div>
        {content.map((post, index) => (
          <swiper-slide key={post.id}>
            <a href={`/${post.link}`}>
              <div
                className={`w-full h-96 lg:h-[700px] bg-black justify-center items-center relative ${
                  (!registered && index > 0) ? "hidden" : "flex"
                }`}
              >
                <DecoImage
                  src={post.image}
                  width={980}
                  height={700}
                  sizes={"100vw"}
                  className="absolute left-0 top-0 w-full h-full object-center object-cover z-0 opacity-30"
                  loading="eager"
                  alt={post.title}
                  preload={index === 0 ? true : false}
                  fetchPriority="high"
                />
                <div className="text-white text-xl text-center font-bold lg:text-6xl lg:max-w-4xl z-10 relative max-w-[220px]">
                  {post.title}
                </div>
              </div>
            </a>
          </swiper-slide>
        ))}
      </swiper-container>
    </div>
  );
}

function NavigationButton({ element, direction }: {
  element?: { current?: SwiperContainer | null };
  direction: "next" | "prev";
}) {
  return (
    <button
      className={`transition-all absolute top-1/2 bg-secondary bg-opacity-60 cursor-pointer h-16 w-8 lg:h-24 lg:w-12 z-20
      transform-gpu -translate-y-1/2 group
      ${
        direction === "next" ? "right-0 rounded-l-2xl" : "left-0 rounded-r-2xl"
      } hover:rounded-none`}
      onClick={() => {
        if (element?.current) {
          if (direction === "next") {
            element.current.swiper.slideNext();
          } else {
            element.current.swiper.slidePrev();
          }
        }
      }}
    >
      <Icon
        id={direction === "next" ? "ChevronRight" : "ChevronLeft"}
        width={24}
        strokeWidth={2}
        className="fill-current text-white h-16 w-8 lg:h-24 lg:w-12"
      />
      <div
        className={`text-white absolute bg-secondary bg-opacity-60 border-transparent border-t-[1.125rem] border-b-[1.125rem]
        px-6 h-24 w-40 top-0 font-bold text-sm transition-transform duration-200 ease-in-out hidden lg:line-clamp-3 transform-gpu ${
          direction === "next"
            ? "left-0 rounded-l-2xl translate-x-full group-hover:-translate-x-full"
            : "right-0 rounded-r-2xl -translate-x-full group-hover:translate-x-full"
        }`}
      >
        <span className={`${direction}-button-label`}></span>
      </div>
    </button>
  );
}

export default Slider;
