import HQSelector from "deco-sites/ultimato/components/HQSelector.tsx";
import SectionTitle from "deco-sites/ultimato/components/ui/SectionTitle.tsx";
import type { ImageWidget as DecoImage } from "apps/admin/widgets.ts";

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
    <>
      <SectionTitle tag="div">
        SELETOR HQS
      </SectionTitle>
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
    </>
  );
}

export default HQSelectorList;
