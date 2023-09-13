import type { JSX } from "preact";

import { Section } from "deco/blocks/section.ts";
import { useLivePageContext } from "deco/pages/LivePage.tsx";

export interface Props {
  /** @description Seção interna */
  innerSection: Section;
  style?: JSX.CSSProperties;
  bgScheme?: "dark" | "light";
  showBg: boolean;
  bgType?: "bacon" | "pattern";
}

const Container = (
  { innerSection, style, showBg, bgScheme, bgType }: Props,
) => {
  if (!innerSection) return <div></div>;

  const { renderSection } = useLivePageContext();

  return (
    <div
      style={style}
      className={`${
        showBg && bgType === "pattern" ? "bg-primary relative" : ""
      } ${bgScheme === "light" ? "bg-white" : ""} ${
        bgScheme === "dark" ? "bg-dark" : ""
      }`}
    >
      <div className="container px-4">
        {renderSection(innerSection, 0)}
      </div>
    </div>
  );
};

export default Container;
