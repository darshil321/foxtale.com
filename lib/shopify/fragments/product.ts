import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    metafields(
      identifiers: [
        { key: "unique", namespace: "custom" }
        { key: "combo_overview", namespace: "custom" }
        { key: "faq-section", namespace: "global" }
        { key: "custom-tab", namespace: "custom" }
      ]
    ) {
      description
      id
      key
      parentResource {
        ... on Product {
          id
          handle
          title
        }
      }
      namespace
      value
    }
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
