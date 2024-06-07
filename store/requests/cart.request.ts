'use server';
import { CartAttributeArgs } from '@shopify/hydrogen-react/storefront-api-types';
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
export async function createCart({
  lines,
  attributes
}: {
  lines?: { id: string; quantity: number };
  attributes?: CartAttributeArgs[];
}) {
  console.log('liness', lines);
  const res = await shopifyFetch({
    query: createCartMutation,
    variables: {
      lineItems: lines,
      attributes: attributes
    }
  });

  return res;
}
