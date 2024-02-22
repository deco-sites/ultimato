import type { JSX } from "preact";
interface Props {
  className?: string;
  style?: JSX.CSSProperties;
  client?: string;
  slot?: string;
  layout?: string;
  layoutKey?: string;
  format?: string;
  responsive?: string;
  pageLevelAds?: boolean;
  adTest?: string;
  children?: JSX.Element;
}

function Ad({
  className = "",
  style = { display: "block" },
  client = "ca-pub-2313803884697164",
  slot = "7806394673",
  layout = "",
  layoutKey = "",
  format = "auto",
  responsive = "false",
  pageLevelAds = false,
  adTest,
  children,
  ...rest
}: Props) {
  return (
    <div className="w-full mx-auto my-8">
      <ins
        className={`adsbygoogle ${className}`}
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        data-adtest={adTest}
        {...rest}
      >
        {children}
      </ins>
    </div>
  );
}

export default Ad;
