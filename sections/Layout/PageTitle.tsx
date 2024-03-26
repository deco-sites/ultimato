import type { ImageWidget } from "apps/admin/widgets.ts";
import GenericCover from "deco-sites/ultimato/components/ui/GenericCover.tsx";

export interface Props {
  title: string;
  image: ImageWidget;
}

function PageTitle({ title, image }: Props) {
  return <GenericCover title={title} image={image} />;
}

export default PageTitle;
