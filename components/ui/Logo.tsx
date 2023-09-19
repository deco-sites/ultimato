import { JSX } from "preact";
import { asset } from "$fresh/runtime.ts";

type ImageProps = Omit<JSX.HTMLAttributes<HTMLImageElement>, "src">;

export interface Props {
  imageProps?: ImageProps;
  anchorProps?: JSX.HTMLAttributes<HTMLAnchorElement>;
}

function Logo({ imageProps, anchorProps }: Props) {
  return (
    <a href="/" {...anchorProps}>
      <img
        src={asset("/images/logo-ultimato-do-bacon.png")}
        alt="Ultimato do Bacon"
        {...imageProps}
      />
    </a>
  );
}

export default Logo;
