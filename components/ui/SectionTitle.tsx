import { JSX } from "preact";

interface Props {
  tag: keyof JSX.IntrinsicElements;
  variation?: "dark" | "light";
}

const SectionTitle: React.FC<Props> = ({ tag, variation, children }) => {
  const baseCss = `uppercase font-extrabold text-xl lg:text-2xl mb-8`;
  const variationCss = variation === "dark" ? `text-secondary` : `text-primary`;

  const Tag = tag;
  return (
    <>
      {tag
        ? <Tag className={`${baseCss} ${variationCss}`}>{children}</Tag>
        : <div className={`${baseCss} ${variationCss}`}>{children}</div>}
    </>
  );
};

export default SectionTitle;
