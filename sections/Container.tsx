import type { JSX } from "preact";

import { Section } from "deco/blocks/section.ts";

export interface Props {
  sections: {
    /** @description Seção interna */
    innerSection: Section;

    /** @description Style */
    style?: JSX.CSSProperties;

    /** @description Background color */
    bgScheme?: "dark" | "light";

    /** @description Background type */
    bgType?: "bacon" | "pattern";
  }[];
}

const Container = (
  { sections }: Props,
) => {
  return (
    <>
      {sections?.map((
        { innerSection: { Component, props }, style, bgScheme, bgType },
      ) => (
        <div
          style={style}
          className={`${
            bgType && bgType === "pattern"
              ? "bg-primary relative"
              : `${bgScheme === "light" ? "bg-white" : "bg-dark"}`
          }`}
        >
          <div className="container px-4">
            <div className="relative z-10">
              <Component {...props} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Container;
