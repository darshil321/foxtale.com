import cartFragment from '../fragments/cart';

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const getMetaobjectsQuery = /* GraphQL */ `
  query metaObjects($type: String!) {
    metaobjects(type: $type, first: 10) {
      edges {
        cursor
        node {
          id
          type

          fields {
            key
            value
            references(first: 10) {
              edges {
                cursor
              }
            }
          }
        }
      }
    }
  }
`;

export const getMagicMetaObjectQuery = /* GraphQL */ `
  query metaObjects {
    metaobjects(type: "magic_link", first: 5) {
      edges {
        cursor
        node {
          id
          type

          fields {
            key
            value
            references(first: 5) {
              edges {
                cursor
              }
            }
          }
        }
      }
    }
  }
`;
