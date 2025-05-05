import { useEffect, useRef } from "preact/hooks";
import { register, SwiperContainer } from "swiper";
import Icon from "deco-sites/ultimato/components/ui/Icon.tsx";

interface Image {
  alt: string;
  url: string;
  sizes?: {
    thumbnail?: {
      url: string;
    };
  };
}

export interface Props {
  images: Image[];
  blockID: string;
}

export default function ImageSlider({ images, blockID }: Props) {
  // Gerar IDs únicos para os sliders
  const mainSwiperClass = `main-swiper-${blockID}`;
  const thumbsSwiperClass = `thumbs-swiper-${blockID}`;

  // Criar referências para os elementos Swiper
  const swiperMainRef = useRef<SwiperContainer>(null);
  const swiperThumbsRef = useRef<SwiperContainer>(null);

  // Inicializar o Swiper quando o componente for montado
  useEffect(() => {
    // Registrar os componentes Swiper
    register();

    // Selecione os elementos pelas classes
    const swiperMainEl = swiperMainRef.current;
    const swiperThumbsEl = swiperThumbsRef.current;

    if (!swiperMainEl || !swiperThumbsEl) {
      return;
    }

    const thumbsSwiperInstance = swiperThumbsEl?.swiper;
    const mainSwiperInstance = swiperMainEl?.swiper;

    const setupSyncEvents = () => {
      if (!mainSwiperInstance || !thumbsSwiperInstance) {
        setTimeout(setupSyncEvents, 100);
        return;
      }

      mainSwiperInstance.off("slideChange");
      thumbsSwiperInstance.off("slideChange");
      thumbsSwiperInstance.off("click");

      mainSwiperInstance.on("slideChange", () => {
        // Verificar se o índice atual é diferente para evitar loop infinito
        if (
          thumbsSwiperInstance.activeIndex !== mainSwiperInstance.activeIndex
        ) {
          // Para thumbnails com muitos slides, precisamos calcular corretamente
          const slideToIndex = Math.min(
            mainSwiperInstance.activeIndex,
            thumbsSwiperInstance.slides.length - 1,
          );

          // Usar slideTo com runCallbacks=false para evitar ciclos
          thumbsSwiperInstance.slideTo(slideToIndex, 300, false);
        }
      });

      thumbsSwiperInstance.on("click", () => {
        const clickedIndex = thumbsSwiperInstance.clickedIndex;

        if (clickedIndex !== undefined && clickedIndex >= 0) {
          mainSwiperInstance.slideTo(clickedIndex);
        }
      });
    };

    setTimeout(setupSyncEvents, 300);

    return () => {
      if (mainSwiperInstance) {
        mainSwiperInstance.off("slideChange");
      }
      if (thumbsSwiperInstance) {
        thumbsSwiperInstance.off("slideChange");
        thumbsSwiperInstance.off("click");
      }
    };
  }, [swiperMainRef, swiperThumbsRef]);

  return (
    <div id={`ub_slider-block-${blockID}`} className="relative mb-8">
      {/* Estilo customizado para os thumbs ativos */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .${thumbsSwiperClass} .swiper-slide-active .thumb-image {
          border-color: rgb(252, 165, 165);
          border-width: 4px;
        }
      `,
        }}
      />

      {/* Slider principal */}
      <swiper-container
        class={`${mainSwiperClass} mb-4`}
        ref={swiperMainRef}
        space-between="0"
        slides-per-view="1"
      >
        <div slot="container-end">
          <NavigationButton
            element={swiperMainRef}
            direction="next"
          />
          <NavigationButton
            element={swiperMainRef}
            direction="prev"
          />
        </div>
        {images &&
          images.map(({ alt, url }, index) => (
            <swiper-slide key={url + index}>
              <img
                src={url}
                alt={alt || `Slide ${index + 1}`}
                className="!my-0 mx-auto cursor-move object-cover h-full max-h-96 w-auto"
                loading="lazy"
              />
            </swiper-slide>
          ))}
      </swiper-container>

      {/* Thumbnails */}
      <swiper-container
        class={`${thumbsSwiperClass} mt-2`}
        ref={swiperThumbsRef}
        space-between="8"
        slides-per-view="6"
        center-insufficient-slides="true"
        centered-slides="true"
        centered-slides-bounds="true"
        watch-slides-progress="true"
        free-mode="true"
        breakpoints='{"768": {"slidesPerView": 12}}'
      >
        {images &&
          images.map(({ alt, sizes }, index) => (
            <swiper-slide key={`${index}`}>
              <div className="thumb-image aspect-square mx-auto cursor-pointer border-4 border-transparent overflow-hidden rounded">
                <img
                  src={sizes?.thumbnail?.url || images[index].url}
                  alt={alt || `Thumbnail ${index + 1}`}
                  className="!my-0 object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
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
      className={`absolute top-1/2 cursor-pointer h-16 w-8 lg:h-24 lg:w-12 z-20 transform-gpu -translate-y-1/2 ${
        direction === "next" ? "right-0" : "left-0"
      }`}
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
        className="fill-current text-primary h-16 w-8 lg:h-24 lg:w-12"
      />
    </button>
  );
}
