import { useEffect, useRef, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import DecoImage from "deco-sites/std/components/Image.tsx";
import Icon from "../components/ui/Icon.tsx";

import {
  register,
  SwiperContainer,
  SwiperSlide,
} from "https://esm.sh/swiper@10.2.0/element/bundle?target=es2022";

// deno-lint-ignore no-explicit-any
type CustomElement<T> = Partial<T & { children: any; key?: any; ref?: any }>;

type Kebab<T extends string, A extends string = ""> = T extends
  `${infer F}${infer R}`
  ? Kebab<R, `${A}${F extends Lowercase<F> ? "" : "-"}${Lowercase<F>}`>
  : A;

type KebabKeys<T> = { [K in keyof T as K extends string ? Kebab<K> : K]: T[K] };
type Stringfy<T> = { [K in keyof T]: string };

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      ["swiper-container"]: CustomElement<KebabKeys<Stringfy<SwiperContainer>>>;
      ["swiper-slide"]: CustomElement<SwiperSlide>;
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
  if (IS_BROWSER) {
    register();
  }

  const swiperElRef = useRef<SwiperContainer>(null);

  const [previewTexts, setPreviewTexts] = useState<{
    prev?: string;
    next?: string;
  }>({
    prev: "",
    next: "",
  });

  function updatePrevAndNextTitles(ref: { current?: SwiperContainer | null }) {
    if (ref.current) {
      const prev = ref.current.querySelector(
        `.swiper-slide-prev`,
      ) as HTMLElement;

      const next = ref.current.querySelector(
        `.swiper-slide-next`,
      ) as HTMLElement;

      if ((!prev && !next) || (!prev && next)) {
        const slides = [
          ...ref.current.querySelectorAll("swiper-slide"),
        ] as Array<HTMLElement>;

        setPreviewTexts({
          prev: prev ? slides[slides.length - 1].innerText : "",
          next: next ? slides[1].innerText : "",
        });

        return;
      }

      setPreviewTexts({
        prev: prev ? prev.innerText : "",
        next: next ? next.innerText : "",
      });
    }
  }

  useEffect(() => {
    if (swiperElRef.current) {
      updatePrevAndNextTitles(swiperElRef);

      swiperElRef.current.addEventListener("slidechange", (e) => {
        setTimeout(() => {
          updatePrevAndNextTitles(swiperElRef);
        }, 500);
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
        autoplay={`{\"delay\":4000}`}
      >
        {content.map((post) => (
          <swiper-slide key={post.id}>
            <a href={`/${post.link}`}>
              <div className="w-full h-96 lg:h-[700px] bg-black flex justify-center items-center relative">
                <DecoImage
                  src={post.image}
                  width={1400}
                  className="absolute left-0 top-0 w-full h-full object-center object-cover z-0 opacity-30"
                  loading="eager"
                  alt={post.title}
                />
                <div className="text-white text-xl text-center font-bold lg:text-6xl lg:max-w-4xl z-10 relative max-w-[220px]">
                  {post.title}
                </div>
              </div>
            </a>
          </swiper-slide>
        ))}
      </swiper-container>
      <NavigationButton
        element={swiperElRef}
        direction="next"
        text={previewTexts.next}
      />
      <NavigationButton
        element={swiperElRef}
        direction="prev"
        text={previewTexts.prev}
      />
    </div>
  );
}

function NavigationButton({ element, direction, text }: {
  element?: { current?: SwiperContainer | null };
  direction: "next" | "prev";
  text?: string;
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
        {text && text}
      </div>
    </button>
  );
}

export default Slider;
