'use server';
import { shopifyFetch } from 'lib/shopify';
import { ensureStartsWith } from 'lib/utils';
import { fetchProductsQuery } from 'store/graphql';
require('dotenv').config();

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';

// const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const endpoint = `https://chirag-test-123.myshopify.com`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
console.log('domainnnnnn', endpoint, key, process.env, domain);

// export async function shopifyFetch<T>({
//   cache = 'force-cache',
//   headers,
//   query,
//   tags,
//   variables
// }: {
//   cache?: RequestCache;
//   headers?: HeadersInit;
//   query: string;
//   tags?: string[];
//   variables?: ExtractVariables<T>;
// }): Promise<{ status: number; body: T } | never> {
//   try {
//     console.log('fetching', query, endpoint, key);

//     const result = await fetch(endpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Shopify-Storefront-Access-Token': key,
//         ...headers
//       },
//       body: JSON.stringify({
//         ...(query && { query }),
//         ...(variables && { variables })
//       }),
//       cache,
//       ...(tags && { next: { tags } })
//     });

//     console.log('body22', result);
//     const body = await result.json();

//     if (body.errors) {
//       throw body.errors[0];
//     }

//     return {
//       status: result.status,
//       body
//     };
//   } catch (e) {
//     if (isShopifyError(e)) {
//       throw {
//         cause: e.cause?.toString() || 'unknown',
//         status: e.status || 500,
//         message: e.message,
//         query
//       };
//     }

//     throw {
//       error: e,
//       query
//     };
//   }
// }

export async function getCart({ first: first }: { first: number }) {
  console.log('first', first);

  const res = await shopifyFetch({
    query: fetchProductsQuery,
    variables: {
      first: first
    }
  });

  return res;
}
