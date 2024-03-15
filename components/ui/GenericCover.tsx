
import { asset } from "$fresh/runtime.ts";
import { stripTags } from "deco-sites/ultimato/utils/content.tsx";

function GenericCover({title} : {title: string }){
  return (
    <div class="relative w-full lg:h-[400px]">
        <div class="z-10 text-white flex flex-col justify-center items-center h-full relative max-w-screen-md mx-auto pt-8">
          <h1 class="max-w-sm lg:max-w-screen-md z-10 text-white font-bold text-2xl lg:text-5xl mx-auto text-center">
            {stripTags(title)}
          </h1>
        </div>
        <img
          src={asset("/images/page_pattern.png")}
          width={1800}
          alt={title}
          className="w-full h-full absolute z-0 object-center object-cover top-0 left-0"
          loading="eager"
        />
      </div>
  )
}

export default GenericCover;
