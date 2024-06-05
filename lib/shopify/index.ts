'use server';
import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getCartQuery, getMagicMetaObjectQuery, getMetaobjectsQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  fetchProductsQuery,
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product';
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  MetaobjectsResponse,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from './types';
import { Metaobject } from '@shopify/hydrogen-react/storefront-api-types';
import { getProductId, getProductIds } from '../helper/helper';
import axios from 'axios';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: { [key: string]: any };
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      next: {
        ...(tags && { tags })
      }
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: 'USD'
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/products/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    }
    // cache: 'no-store'
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
    // cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
    cache: 'no-store'
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<any[]> {
  console.log(sortKey);

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse
    }
  });

  if (!res.body.data.collection) {
    return [];
  }

  let products = reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
  products = products.map((p: any) => ({
    ...p,
    collections: removeEdgesAndNodes(p.collections).map((c) => c.title)
  }));

  // Append reviews and ratings to products
  // products = await appendReviewAndRating(products);

  return products;
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/products',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url.replace(domain, '').replace('/collections', '/products').replace('/pages', '')
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    cache: 'no-store',
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
    cache: 'no-store'
  });

  return removeEdgesAndNodes(res.body.data.pages);
}
export async function getMetaObjects(type: string): Promise<Metaobject[]> {
  const res = await shopifyFetch<MetaobjectsResponse>({
    query: getMetaobjectsQuery,
    cache: 'no-store',
    variables: { type }
  });

  return removeEdgesAndNodes(res.body.data.metaobjects);
}

export async function getMagicLinkMetaObjects(): Promise<Metaobject[]> {
  const res = await shopifyFetch<MetaobjectsResponse>({
    query: getMagicMetaObjectQuery,
    cache: 'no-store'
  });
  return removeEdgesAndNodes(res.body.data.metaobjects);
}

export async function getProduct(handle: string): Promise<Product | undefined | any> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(productId: string): Promise<Product[] | any> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
} = {}): Promise<any> {
  try {
    const res = await shopifyFetch<ShopifyProductsOperation>({
      cache: 'no-store',
      query: getProductsQuery,
      tags: [TAGS.products],
      variables: {
        query,
        reverse,
        sortKey
      }
    });

    const products = reshapeProducts(removeEdgesAndNodes(res.body.data.products));
    return products.map((p: any) => ({
      ...p,
      collections: removeEdgesAndNodes(p.collections).map((c) => c.id)
    }));
  } catch (e) {}
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = headers().get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export async function getProductsData(first: number): Promise<any> {
  try {
    const res = await shopifyFetch<any>({
      query: fetchProductsQuery,
      variables: { first },
      tags: [TAGS.cart],
      cache: 'no-store'
    });
    return res;

    // Old carts becomes `null` when you checkout.
    // if (!res.body.data.cart) {
    //   return undefined;
    // }
  } catch (err) {}

  // return reshapeCart(res.body.data.cart);
}
export async function appendReviewAndRating(products: any) {
  try {
    const productIds = products.map((product: any) => product.id);
    // const reviews = await getReviewsById();
    const ratings = await getRatingsById(productIds);

    // reviews.forEach((review: any) => {
    //   const product = products.find((product: any) => {
    //     const id = getProductId(product.id);

    //     return id === review.external_product_id;
    //   });
    //   if (product) {
    //     product.reviews = review;
    //   }
    // });

    ratings?.forEach((rating: any) => {
      const product = products.find((product: any) => {
        const id = getProductId(product.id);
        return id === rating.external_product_id;
      });
      if (product) {
        product.ratings = rating;
      }
    });

    return products;
  } catch (error) {
    throw error;
  }
}
export async function appendReviewAndRatingInProduct(product: any) {
  try {
    const id = getProductId(product.id);
    const reviews = await getReviewsById(id, 1, 10);
    const ratings = await getRatingsById(id);
    const productRating = ratings.find((rating: any) => rating.subject === 'product');
    const productReviews = reviews?.data
      .filter((rating: any) => rating.subject === 'product')
      .filter((reviews: any) => reviews.is_anonymous !== true)
      .filter((reviews: any) => reviews.heading && reviews.customer.generated_display_name);

    product.ratings = productRating;
    product.reviews = productReviews;
    product.reviewsCount = reviews?.total;

    return product;
  } catch (error) {
    throw error;
  }
}
export async function getReviewsById(id?: string, page = 1, pageSize = 10) {
  const productId = id && getProductId(id);

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const url = productId
    ? `https://api.fera.ai/v3/private/reviews?external_product_id=${productId}&limit=${limit}&offset=${offset}&sort_by=highest_quality`
    : `https://api.fera.ai/v3/private/reviews?limit=${limit}&offset=${offset}&sort_by=highest_quality`;

  try {
    const reviewApiOptions = {
      method: 'get',
      url: url,
      headers: {
        accept: 'application/json',
        'SECRET-KEY': process.env.NEXT_PUBLIC_FERA_FOXTALE_SECRET_KEY
      }
    };
    const response = await axios.request(reviewApiOptions);
    const reviews = response.data.data;

    return {
      data: reviews,
      total: response.data.meta.total_count
    };
  } catch (e) {
    console.log('Error fetching reviews:', e);
  }
}

export async function getRatingsById(id: string | string[]) {
  let productId;

  if (typeof id === 'string') {
    productId = getProductId(id);
  } else {
    productId = getProductIds(id);
  }
  const url = `https://api.fera.ai/v3/private/ratings?page_size=100&external_ids=${productId}`;

  try {
    const ratingApiOptions = {
      method: 'GET',
      url: url,
      headers: {
        accept: 'application/json',
        'SECRET-KEY': process.env.NEXT_PUBLIC_FERA_FOXTALE_SECRET_KEY
      }
    };
    const response = await axios.request(ratingApiOptions);
    const ratings = response.data.data;

    return ratings;
  } catch (e) {
    console.log('e', e);
  }
}
export async function createReview(body: any) {
  const url = `https://api.fera.ai/v3/private/reviews`;

  try {
    const reviewApiOptions = {
      method: 'POST',
      url: url,
      headers: {
        accept: 'application/json',
        'SECRET-KEY': process.env.NEXT_PUBLIC_FERA_FOXTALE_SECRET_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        ...body
      }
    };
    const response = await axios.request(reviewApiOptions);
    const reviews = response.data;

    return reviews;
  } catch (e) {
    console.log('Error:', e);
    throw e;
  }
}
export async function updateReview(body: any, id: string) {
  const url = `https://api.fera.ai/v3/private/reviews/${id}`;

  try {
    const reviewApiOptions = {
      method: 'PUT',
      url: url,
      headers: {
        accept: 'application/json',
        'SECRET-KEY': process.env.NEXT_PUBLIC_FERA_FOXTALE_SECRET_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        ...body
      }
    };
    const response = await axios.request(reviewApiOptions);
    const reviews = response.data;

    return reviews;
  } catch (e) {
    console.log('Error:', e);
    throw e;
  }
}
export async function createCustomer(body: any) {
  const url = `https://api.fera.ai/v3/private/customers`;

  try {
    const user = {
      method: 'POST',
      url: url,
      headers: {
        accept: 'application/json',
        'SECRET-KEY': process.env.NEXT_PUBLIC_FERA_FOXTALE_SECRET_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        ...body
      }
    };
    const response = await axios.request(user);
    const userData = response.data;

    return userData;
  } catch (e) {
    console.log('Error:', e);
    throw e; // Optional: rethrow the error to handle it outside the function
  }
}
export async function uploadMedia(formData: FormData) {
  const url = `https://api.fera.ai/v3/private/media`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        accept: 'application/json',
        'SECRET-KEY': process.env.NEXT_PUBLIC_FERA_FOXTALE_SECRET_KEY
        // 'Content-Type': 'multipart/form-data' // Do not set Content-Type manually
      }
    });
    const media = response.data;
    return media;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
}
