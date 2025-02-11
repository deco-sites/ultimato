import { useState } from "react";
import tw, { styled } from "twin.macro";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Lazy, Thumbs } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/thumbs/thumbs.scss";
SwiperCore.use([Thumbs, Lazy]);

export default function ImageSlider({ images, blockID }) {
  const [swiperThumbs, updateSwiperThumbs] = useState<SwiperCore>();

  return (
    <SwiperWrapper id={`ub_slider-block-${blockID}`}>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        wrapperTag="ul"
        lazy={true}
        thumbs={{ swiper: swiperThumbs }}
        onInit={(swiper) => {
          swiper && swiper.navigation && swiper.navigation.update();
        }}
      >
        {images &&
          images.map(({ alt, url }, index) => (
            <SwiperSlide
              style={{
                height: "unset !important",
              }}
              key={url + index}
            >
              <Img src={url} alt={alt} />
            </SwiperSlide>
          ))}
      </Swiper>
      <Swiper
        spaceBetween={8}
        slidesPerView={6}
        centerInsufficientSlides={true}
        centeredSlides={true}
        centeredSlidesBounds={true}
        watchSlidesProgress={true}
        watchSlidesVisibility={true}
        freeMode={true}
        lazy={true}
        onSwiper={updateSwiperThumbs}
        wrapperTag="ul"
        breakpoints={{
          768: {
            slidesPerView: 12,
          },
        }}
      >
        {images &&
          images.map(({ alt, sizes }, index) => (
            <SwiperSlide key={index}>
              <Thumbnail src={sizes?.thumbnail?.url} alt={alt} />
            </SwiperSlide>
          ))}
      </Swiper>
    </SwiperWrapper>
  );
}

const Img = styled.img`
  ${tw`mx-auto cursor-move object-cover h-full`}
`;

const Thumbnail = styled.img`
  ${tw`w-20 mx-auto cursor-pointer border-4 border-transparent`}
`;

const SwiperWrapper = styled.div`
  .swiper-slide-thumb-active {
    img {
      ${tw`border-4 border-red-300`}
    }
  }

  .swiper-wrapper {
    ${tw`items-stretch`}
  }

  .swiper-slide {
    ${tw`h-auto`}
  }
`;
