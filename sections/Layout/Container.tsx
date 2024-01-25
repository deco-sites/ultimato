import { Section } from "deco/blocks/section.ts";
import { asset } from "$fresh/runtime.ts";

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
              : `${
                bgScheme === "light"
                  ? "bg-white group/container-light"
                  : "bg-dark group/container-dark"
              }`
          }`}
        >
          {bgType && bgType === "bacon" &&
            (
              <FlyingBacons
                bg={bgScheme ?? "light"}
              />
            )}
          {bgType && bgType === "pattern" &&
            (
              <img
                src={`${asset("/images/ub-pattern.png")}`}
                alt="pattern hq"
                class="absolute top-0 left-0 w-full h-full object-cover mix-blend-multiply pointer-events-none select-none"
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
