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
  storefrontAccessToken: 'acde80e04f92b5b57c45b6393baf2dd4',
  shopifyGraphQlUrl: 'https://foxtale-consumer.myshopify.com/api/2024-01/graphql.json'
};
