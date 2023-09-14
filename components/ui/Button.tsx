import { JSX } from "preact";

export interface Props {
  link: string;
  className?: string;
  anchorProps?: Omit<
    JSX.HTMLAttributes<HTMLAnchorElement>,
    "className" | "href" | "rel" | "target"
  >;
  children: JSX.Element;
}

const Button = (
  { link, anchorProps, className, children }: Props,
) => {
  const isExternal = link.includes("http");

  const externalProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      className={`px-6 py-4 rounded-lg ${className || ""}`}
      href={link}
      {...externalProps}
      {...anchorProps}
    >
      {children}
    </a>
  );
};

export default Button;
