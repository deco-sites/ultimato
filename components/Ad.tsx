import { Adsense } from "npm:@ctrl/react-adsense";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  layout?: string;
  layoutKey?: string;
  format?: string;
  responsive?: string;
  // eslint-disable-next-line react/boolean-prop-naming
  pageLevelAds?: boolean;
};

export function Ad(props: Props) {
  return (
    <div className="w-full mx-auto my-8">
      <Adsense client="ca-pub-2313803884697164" slot="7806394673" {...props} />
    </div>
  );
}

export default Ad;
