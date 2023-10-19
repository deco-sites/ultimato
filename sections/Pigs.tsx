import PigsSlider from "deco-sites/ultimato/islands/PigsSlider.tsx";

import type { SectionProps } from "deco/mod.ts";

import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type { RootQueryToPostConnection } from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  FeaturedImageFields,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

interface LoaderReturn {
  posts: {
    id: string;
    slug: string;
    title: string;
    image?: string;
    alt?: string;
  }[];
}

export const loader = async (
  _props: unknown,
  _req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const posts = await client.query<{ pigs: RootQueryToPostConnection }>(
    Query,
    {},
    "getPigs",
  );

  const response = posts?.pigs?.edges?.map((edge) => {
    const post = edge?.node;

    return {
      id: post?.id,
      slug: post?.slug,
      title: post?.title,
      image: post?.featuredImage?.node?.sourceUrl,
      alt: post?.featuredImage?.node?.altText,
    };
  }) as LoaderReturn["posts"];

  return { posts: response };
};

const Query = gql`
${FeaturedImageFields}
query getPigs {
  pigs: posts(where: { categoryName: "porquinhos" }) {
    edges {
      node {
        id
        title
        slug
        featuredImage {
          node {
            ...FeaturedImageFields
          }
        }
      }
    }
  }
}
`;

function Porquinhos({ posts }: SectionProps<typeof loader>) {
  if (!posts) return null;

  console.log(posts);

  return (
    <div className="relative">
      <div className="container px-4 pt-6">
        <PigsSlider posts={posts} />
      </div>
    </div>
  );
}

export default Porquinhos;
