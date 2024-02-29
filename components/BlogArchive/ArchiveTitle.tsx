import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type { SectionProps } from "deco/mod.ts";

import FlyingBacons from "deco-sites/ultimato/islands/FlyingBacons.tsx";

export interface Props {
  /** @description Categoria */
  categoria?: string;
}

export interface LoaderReturn {
  category?: string;
}

function ArchiveTitle({ category }: SectionProps<typeof loader>) {
  return (
    <div class="container-wrapper">
      <div class="h-[290px] lg:h-[500px] relative w-full bg-gradient-to-b from-[#18181B] via-gray-700 to-gray-600 bacon-background">
        <FlyingBacons bg="dark" density={2} spread />
        <div class="z-10 text-white flex flex-col justify-center items-center h-full relative max-w-screen-md mx-auto pt-8">
          <h1 class="font-extrabold mb-4 text-xl max-w-xs text-center lg:text-4xl lg:max-w-max">
            {category}
          </h1>
        </div>
      </div>
    </div>
  );
}

export const loader = async (
  { categoria }: Props,
  req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const urlPath = new URL(req.url).pathname;
  const urlArrayPath = urlPath.slice(1).split("/");

  const indexOfCategory = urlArrayPath.indexOf("categoria");
  const isCategoryPage = indexOfCategory !== -1;

  const category = categoria ||
    (isCategoryPage ? urlArrayPath[indexOfCategory + 1] : undefined);

  const categoryInfo = category
    ? await client.query<{ category: { name: string } }>(
      CategoryQuery,
      { id: category },
      "getCategory",
    )
    : undefined;

  return { category: categoryInfo?.category?.name };
};

const CategoryQuery = gql`
  query getCategory($id: ID!) {
    category(id: $id, idType: SLUG) {
      name
    }
  }
`;

export default ArchiveTitle;
