/*
PLEASE DON'T CHANGE ANY VALUES WITHOUT CONFIRMATION AS THAT WILL DIRECTLY IMAPCT THE FUNCTIONING OF THE GOKWIK CHECKOUT

Keys required:
mid: store identifier for Gokwik checkout
env: API environment for Gokwik checkout
storefrontAccessToken: Storefront API access token for Gokwik app installed on your store
shopifyGraphQlUrl: Graph QL API for your store, follows the format-
					https://{store_name}.myshopify.com/api/{api-version}/graphql.json

*/

export const gokwikConfig = {
  mid: '19g6ilvotqthm',
  env: 'production',
  storefrontAccessToken: '847d377ea46e50bf9d66b58c4bd70b96',
  shopifyGraphQlUrl: 'https://chirag-test-123.myshopify.com/api/2024-01/graphql.json'
};
