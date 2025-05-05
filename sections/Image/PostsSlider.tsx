import Slider from "../../islands/Slider.tsx";
import GenericCover from "deco-sites/ultimato/components/ui/GenericCover.tsx";
import { AppContext } from "../../apps/site.ts";
import type { BlogPost, Media } from "deco-sites/ultimato/utils/transform.ts";
import { type SectionProps } from "@deco/deco";
export interface Props {
  /** @description Quantidade de posts */
  postNumber?: number;
  /** @description Categoria */
  categoria?: number;
}
export interface LoaderResponse extends Props {
  posts?: BlogPost[];
}
const loader = async (
  { postNumber = 5, categoria }: Props,
  req: Request,
  ctx: AppContext,
): Promise<LoaderResponse> => {
  const urlPath = new URL(req.url).pathname;
  const urlArrayPath = urlPath.slice(1).split("/");
  const indexOfCategory = urlArrayPath.indexOf("hqs");
  const isCategoryPage = indexOfCategory !== -1;
  const category = categoria
    ? categoria.toString()
    : (isCategoryPage ? urlArrayPath[indexOfCategory + 1] : undefined);
  const variables = {
    perPage: postNumber,
    categories: category ? category : "16",
  };
  const postList = await ctx.invoke(
    "deco-sites/ultimato/loaders/post-archive.ts",
    variables,
  );
  if (postList.pageContext.status === 404) {
    ctx.response.status = 404;
  }
  return {
    postNumber,
    categoria,
    posts: postList.posts,
  };
};
function PostsSlider({ posts }: SectionProps<typeof loader>) {
  if (!posts || posts?.length === 0) {
    return <GenericCover title="Erro 404" />;
  }
  const sliderData = posts.filter(({ id, title, slug, image }) =>
    id && title && slug && image
  ).map(({ id, title, slug, image }) => {
    return {
      id,
      title,
      image: (image as Media).url,
      link: slug,
    };
  });
  return (
    <>
      {sliderData && sliderData.length > 0 && <Slider content={sliderData} />}
    </>
  );
}
export default PostsSlider;
export { loader };
