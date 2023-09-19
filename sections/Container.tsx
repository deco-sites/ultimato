import { Section } from "deco/blocks/section.ts";

import FlyingBacons from "deco-sites/ultimato/islands/FlyingBacons.tsx";

export interface Props {
  sections: {
    /** @description Seção interna */
    innerSection: Section;

    /** @description Style */
    style?: string;

    /**
     * @title Esquema de cores
     * @description Background color
     */
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
        index,
      ) => (
        <div
          key={index}
          style={style}
          className={`container-wrapper ${
            bgType && bgType === "pattern"
              ? "bg-primary relative"
              : `${bgScheme === "light" ? "bg-white" : "bg-dark"}`
          }`}
        >
          {bgType && bgType === "bacon" &&
            (
              <FlyingBacons
                bg={bgScheme ?? "light"}
              />
            )}

          <div
            className={`container px-4 ${
              bgType
                ? (bgType === "bacon"
                  ? "bacon-background"
                  : "pattern-background")
                : ""
            }`}
          >
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
