import HQSelector from "deco-sites/ultimato/components/HQSelector.tsx";
import type { Image as DecoImage } from "deco-sites/std/components/types.ts";

/** @title {{{name}}} */
export interface Selectors {
  /** @description slug da categoria */
  slug: string;

  /** @description nome da categoria */
  name: string;

  /** @description imagem da categoria */
  image?: DecoImage;
}

export interface Props {
  /** @description Categorias dos seletores */
  selectors: Array<Selectors>;
}

function HQSelectorList({ selectors }: Props) {
  return (
    <div className="overflow-x-auto w-full max-w-full">
      <div className="flex lg:justify-center lg:mb-12 xl:grid grid-cols-9 xl:grid-cols-3 lg:gap-4 2xl:gap-8">
        {selectors &&
          selectors.map(({ slug, name, image }, index) => {
            return (
              <HQSelector
                key={index}
                image={image}
                title={name}
                link={`/hqs-${slug}`}
              />
            );
          })}
      </div>
    </div>
  );
}

export default HQSelectorList;
