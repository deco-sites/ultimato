import Ad from "deco-sites/ultimato/components/Ad.tsx";

export interface Props {
  slot?: string;
  layout?: string;
  layoutKey?: string;
  format?: string;
  responsive?: string;
}

export default function Adsense(props: Props) {
  return <Ad {...props} />;
}
