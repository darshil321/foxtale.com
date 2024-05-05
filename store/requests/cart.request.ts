'use server';
import { shopifyFetch } from 'lib/shopify';
import { createCartMutation } from 'lib/shopify/mutations/cart';
import { getCartQuery } from 'lib/shopify/queries/cart';
import { ensureStartsWith } from 'lib/utils';
// import { fetchProductsQuery } from 'store/graphql';
require('dotenv').config();

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';

// const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const endpoint = `https://chirag-test-123.myshopify.com`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
console.log('domainnnnnn', endpoint, key, process.env, domain);

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
