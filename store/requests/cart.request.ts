'use server';
import { shopifyFetch } from 'lib/shopify';
import { createCartMutation } from 'lib/shopify/mutations/cart';
import { getCartQuery } from 'lib/shopify/queries/cart';

export async function getCart({ cartId: cartId }: { cartId: any }) {
  const res = await shopifyFetch({
    query: getCartQuery,
    variables: {
      cartId: cartId
    }
  });

  return res;
}
export async function createCart({ lines }: { lines: any }) {
  const res = await shopifyFetch({
    query: createCartMutation,
    variables: {
      input: { lines }
    }
  });

  return res;
}
