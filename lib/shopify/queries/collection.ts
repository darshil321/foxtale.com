import productFragment from '../fragments/product';
import seoFragment from '../fragments/seo';

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
  }
  ${seoFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 250, sortKey: TITLE) {
      edges {
        node {
          ...collection
          id
          title
          description
          seo {
            ...seo
          }
          updatedAt
          image {
            url
            altText
            width
          }
          products(first: 100) {
            edges {
              node {
                id
                title
                description
                handle
                createdAt
                updatedAt
                images(first: 1) {
                  edges {
                    node {
                      originalSrc
                      altText
                      width
                      height
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: 15) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;
