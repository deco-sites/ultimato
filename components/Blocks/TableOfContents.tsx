export interface Props {
  children: JSX.Element;
}

export default function TableOfContents({ children }: Props) {
  return (
    <div class="collapse collapse-arrow border-2 border-red-200 rounded-lg bg-gray-100">
      <input type="checkbox" />
      <h2 class="collapse-title text-xl font-bold !text-primary !m-0">
        <span class="!text-[var(--tw-prose-headings)]">Índice</span>
      </h2>
      <div class="collapse-content">{children}</div>
    </div>
  );
}
