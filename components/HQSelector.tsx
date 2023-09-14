import DecoImage from "deco-sites/std/components/Image.tsx";

export interface Props {
  image?: string;
  title?: string;
  link: string;
}

function HQSelector({ image, title, link }: Props) {
  return (
    <a href={link} className="mr-4 lg:mr-0">
      <div className="overflow-y-hidden overflow-x-hidden rounded-full border-4 border-primary w-20 h-20 mx-auto mb-4">
        {image && (
          <DecoImage
            className="border-2 border-white rounded-full w-full h-full object-contain overflow-hidden"
            width={80}
            height={80}
            src={image}
            alt={title}
            loading="lazy"
          />
        )}
      </div>

      <div className="text-center text-xs font-bold">{title}</div>
    </a>
  );
}

export default HQSelector;
