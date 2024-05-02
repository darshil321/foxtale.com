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
  query metaObjects {
    metaobjects(type: "coupon_bxgy", first: 5) {
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
