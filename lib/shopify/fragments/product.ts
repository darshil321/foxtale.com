import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    collections(first: 150) {
      edges {
        node {
          id
          title
        }
      }
    }
    metafields(
      identifiers: [
        { key: "unique", namespace: "custom" }
        { key: "combo_overview", namespace: "custom" }
        { key: "faq-section", namespace: "global" }
        { key: "custom-tab", namespace: "custom" }
        { key: "hp_excerpt", namespace: "my_fields" }
        { key: "routinename1", namespace: "custom" }
        { key: "routinename2", namespace: "custom" }
        { key: "product-sub-title", namespace: "global" }
        { key: "product_tag", namespace: "custom" }
        { key: "boost_with", namespace: "product_handle" }
        { key: "pair_best_with", namespace: "product_handle" }
        { key: "group_product_items", namespace: "my_fields" }
        { key: "pr_excerpt", namespace: "custom" }
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
          weight
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
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
