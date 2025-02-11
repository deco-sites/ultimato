import Icon from "deco-sites/ultimato/components/ui/Icon.tsx";

export interface Props {
  children: JSX.Element;
}

export default function TableOfContents({ children }: Props) {
  return (
    <div class="py-4 pl-4 pr-8 border-2 border-red-200 rounded-lg relative bg-gray-100">
      <h2
        class="text-xl font-bold"
        style={{
          margin: 0,
          color: "rgb(63, 63, 70)",
        }}
      >
        Índice
      </h2>
      <button class="absolute right-4 top-4">
        <Icon
          id="ChevronUp"
          class="w-4 lg:w-6 transform transition-all origin-center duration-300 text-primary fill-current"
        />
      </button>
      <div class="navigation overflow-hidden">{children}</div>
    </div>
  );
}
