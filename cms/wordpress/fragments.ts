import { gql } from "deco-sites/ultimato/cms/wordpress/client.ts";

export const MenuFields = gql`
  fragment MenuFields on MenuItem {
    id
    url
    title
    path
    label
  }
`;
export const MenuChildren = gql`
  fragment MenuChildren on MenuItem {
    childItems {
      nodes {
        ...MenuFields
      }
    }
  }
`;
export const PostFields = gql`
  fragment PostFields on Post {
    id
    databaseId
    title
    excerpt
    slug
    date
    readingTime
    content
    author {
      node {
        name
        firstName
        lastName
      }
    }
    categories {
      nodes {
        name
        slug
        databaseId
        uri
        ancestors {
          nodes {
            slug
          }
        }
      }
    }
  }
`;

export const PageFields = gql`
  fragment PageFields on Page {
    id
    databaseId
    title
    slug
    content
  }
`;

export const SeoFields = gql`
  fragment SeoFields on PostTypeSEO {
    title
    metaDesc
    metaKeywords
    canonical
    opengraphModifiedTime
    opengraphPublishedTime
    opengraphPublisher
    opengraphSiteName
    opengraphTitle
    opengraphType
    opengraphUrl
    opengraphAuthor
    opengraphDescription
    opengraphImage {
      altText
      sourceUrl
    }
    twitterTitle
    twitterDescription
    twitterImage {
      sourceUrl
    }
    schema {
      articleType
      pageType
    }
  }
`;

export const PostArchiveFields = gql`
  fragment PostArchiveFields on Post {
    id
    title
    excerpt
    slug
    date
    readingTime
    categories {
      nodes {
        slug
        name
        uri
        ancestors {
          nodes {
            slug
          }
        }
      }
    }
  }
`;

export const FeaturedImageFields = gql`
  fragment FeaturedImageFields on MediaItem {
    sourceUrl
    altText
  }
`;
