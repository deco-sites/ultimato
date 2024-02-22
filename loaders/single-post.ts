import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type {
  Category,
  Post,
  RootQueryToPostConnection,
  RootQueryToPostConnectionEdge,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  PostFields,
  SeoFields,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

export interface LoaderReturn {
  singlePost?: Post;
  relatedPosts?: Post[];
}

export const loader = async (
  _props: unknown,
  req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const variables = {
    slug: new URL(req.url).pathname.slice(1).split("/")[0],
  };

  const singlePost = await client.query<{ singlePost: Post }>(
    PostsQuery,
    variables,
    "getSinglePost",
  );

  const postID = singlePost?.singlePost.databaseId as number;
  const postCategoriesIDs =
    (singlePost?.singlePost?.categories?.nodes as Category[]).map((item) =>
      item.databaseId
    );

  const relatedPosts = await client.query<
    { relatedPosts: RootQueryToPostConnection }
  >(
    RelatedPostsQuery,
    {
      postIDs: [postID],
      categories: postCategoriesIDs,
    },
    "getRelatedPosts",
  );

  const related =
    (relatedPosts?.relatedPosts?.edges as RootQueryToPostConnectionEdge[]).map(
      (item) => item.node as Post,
    );

  return { ...singlePost, relatedPosts: related };
};

const PostsQuery = gql`
  ${PostFields}
  ${SeoFields}
  query getSinglePost($slug: ID!){
    singlePost: post(id: $slug, idType: SLUG) {
    ...PostFields
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        ...SeoFields
      }
    }
  }
`;

const RelatedPostsQuery = gql`
  query getRelatedPosts ($postIDs: [ID!],  $categories: [ID!]) {
    relatedPosts: posts(where: {categoryIn: $categories, notIn: $postIDs, offsetPagination: {size: 3}}) {
      edges {
        node {
          id
          title
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }

`;

export default loader;
