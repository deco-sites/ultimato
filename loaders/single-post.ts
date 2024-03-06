import {
  createClient,
  endpoint,
  gql,
} from "deco-sites/ultimato/cms/wordpress/client.ts";

import type {
  Category,
  Page,
  Post,
  RootQueryToPostConnection,
  RootQueryToPostConnectionEdge,
} from "deco-sites/ultimato/cms/wordpress/graphql-types.ts";

import {
  PageFields,
  PostFields,
  SeoFields,
} from "deco-sites/ultimato/cms/wordpress/fragments.ts";

export interface LoaderReturn {
  contentTypeName?: string;
  singlePost?: Post;
  relatedPosts?: Post[];
  page?: Page;
}

export const loader = async (
  _props: unknown,
  req: Request,
): Promise<LoaderReturn> => {
  const client = createClient({ endpoint });

  const variables = {
    slug: new URL(req.url).pathname.slice(1).split("/")[0],
  };

  const contentType = await client.query<
    { contentNode: { contentTypeName: string } }
  >(
    GetContentType,
    { id: `/${variables.slug}` },
    "getContentType",
  );

  if (contentType?.contentNode.contentTypeName === "page") {
    const page = await client.query<{ page: Page }>(
      PageQuery,
      variables,
      "getPage",
    );

    return {
      ...page,
      contentTypeName: contentType.contentNode.contentTypeName,
    };
  }

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

  return {
    ...singlePost,
    relatedPosts: related,
    contentTypeName: contentType?.contentNode.contentTypeName,
  };
};

const GetContentType = gql`
  query getContentType($id: ID!) {
    contentNode(id: $id, idType: URI) {
      contentTypeName
    }
  }
`;

const PageQuery = gql`
${PageFields}
${SeoFields}
query getPage($slug: ID!) {
  page(id: $slug, idType: URI) {
    ...PageFields
    seo {
      ...SeoFields
    }
  }
}
`;

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
