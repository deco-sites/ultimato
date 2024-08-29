import { domToReact } from "html-react-parser";
import type { Element } from "https://esm.sh/domhandler@5.0.3";

import ImageSlider from "./ImageSlider.tsx";
import TableOfContents from "./TableOfContents.tsx";

export const parseBlocks = (node: Element) => {
  if (node.attribs && node.attribs.id === "ez-toc-container") {
    return (
      <TableOfContents>
        <>
          {domToReact(
            (node.children as Element[]).filter(({ name }) => name === "nav"),
          )}
        </>
      </TableOfContents>
    );
  }

  if (
    node.attribs &&
    node.attribs.class &&
    node.attribs.class == "ub_image_slider"
  ) {
    const dataImages64 = node.attribs["data-images"];
    const images = JSON.parse(atob(dataImages64));
    return <ImageSlider blockID={images.blockId} images={images.images} />;
  }

  if (node.attribs && node.attribs.style && node.name === "span") {
    const nodeStyle = node.attribs.style
      .replace(/font-family:(\s?\w+,){1,3}(\s?\S+);/, "")
      .replace(/font-size:(\s?\d+\w+);/, "");

    node.attribs.style = nodeStyle;

    return node;
  }

  if (
    node.name === "p" &&
    node.children[0] &&
    (node.children[0] as Element).name === "span" &&
    (node.children[0] as Element).children.length === 0
  ) {
    return <div />;
  }

  if (
    node.name === "p" &&
    node.children[0] &&
    (node.children[0] as Element).name === "span" &&
    (node.children[0] as Element).children[0] &&
    ((node.children[0] as Element).children[0] as Element).data &&
    ((node.children[0] as Element).children[0] as Element).data === "."
  ) {
    return <div />;
  }
};
