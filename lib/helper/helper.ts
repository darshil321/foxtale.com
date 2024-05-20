/* eslint-disable no-unused-vars */

import { Metaobject } from '@shopify/hydrogen-react/storefront-api-types';
import axios from 'axios';
import { Cart, CartItem, Connection } from '../shopify/types';
import { v4 as uuidv4 } from 'uuid';

interface Field {
  [key: string]: string;
}
export interface MetaObject {
  id: string;
  type: string;
  fields: Field;
}

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: NodeJS.Timeout | undefined;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export async function appendReviewAndRating(products: any) {
  try {
    const reviews = await getReviews();
    const ratings = await getRatings();

    reviews.forEach((review: any) => {
      const product = products.find((product: any) => {
        const id = getProductId(product.id);
        return id === review.external_product_id;
      });
      if (product) {
        product.reviews = review;
      }
    });

    ratings.forEach((rating: any) => {
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

const getProductId = (id: string): string => {
  const parts = id.split('/');

  // Extracting the part from the last occurrence of slash till the first occurrence
  const extractedId = parts.slice(-1)[0];

  return extractedId as string;
};

async function getReviews() {
  try {
    const reviewApiOptions = {
      method: 'GET',
      url: 'https://api.fera.ai/v3/private/reviews',
      headers: {
        accept: 'application/json',
        'SECRET-KEY': process.env.FERA_FOXTALE_SECRET_KEY
      }
    };
    const response = await axios.request(reviewApiOptions);
    const reviews = response.data.data;
    return reviews;
  } catch (e) {
    console.log('e', e);
  }
}

async function getRatings() {
  try {
    const ratingApiOptions = {
      method: 'GET',
      url: 'https://api.fera.ai/v3/private/ratings',
      headers: {
        accept: 'application/json',
        'SECRET-KEY': process.env.FERA_FOXTALE_SECRET_KEY
      }
    };
    const response = await axios.request(ratingApiOptions);
    const ratings = response.data.data;
    return ratings;
  } catch (e) {
    console.log('e', e);
  }
}

export function getCoupon(metaObjects: any, cart: any, type: string, magic_key: any) {
  if (type === 'magic_link') {
    const magicArray = metaObjects.map((metaObj: any) => {
      if (metaObj.type === 'magic_link') {
        const obj: any = {};
        metaObj.fields.forEach((field: any) => {
          obj[field.key] = field.value;
        });
        return obj;
      }
    });

    const offerObj = magicArray.find((obj: any) => obj.magic_key === magic_key);

    const cartItems = cart.lines;
    const { totalQuantity } = cart;
    if (offerObj.total_quantity > totalQuantity) {
      return;
    }

    const freeProduct = magicArray.find((obj: any) => {
      if (obj.applicable_product) {
        const product = cartItems?.find(
          (item: any) => item.merchandise.id === obj.applicable_product
        );
        if (product) {
          return obj.free_product;
        }
      } else if (obj.cart_total) {
        let cartTotal = 0;
        cartItems.forEach((item: any) => {
          cartTotal += +item.cost.totalAmount.amount;
        });

        if (cartTotal >= obj.cart_total) {
          return obj.free_product;
        }
      } else {
        // applicable collection logic
      }
    });

    if (freeProduct) {
      return freeProduct;
    }
  }
}

export const getDefaultVariant = (product: any, variantId?: string) => {
  if (!variantId) {
    return product.variants[0];
  } else {
    return product.variants.find((v: any) => v.id === variantId);
  }
};

export const isGiftProductAvailableInCart = (cart: Cart, variantIds: string[]) => {
  const variantIdsInCart = cart.lines?.map((item: CartItem) => item.merchandise.id);
  return variantIds.some((variantId) => variantIdsInCart?.includes(variantId)) ?? false;
};
export const isThisGiftProductAvailableInCart = (cart: Cart, variantId: string) => {
  const variantIdsInCart = cart.lines?.map((item: CartItem) => item.merchandise.id);
  return variantIdsInCart?.includes(variantId) ?? false;
};

export const findClosestCoupon = (
  metaObjects: MetaObject[],
  updatedCart: Cart | null
): Metaobject | undefined => {
  let closestObject;
  let minDifference = Infinity;

  metaObjects.forEach((obj) => {
    const buyXQuantity = parseInt(obj?.fields?.buy_x_quantity ?? '');
    const priceCap = parseInt(obj?.fields?.price_cap ?? '');
    if (
      buyXQuantity <= Number(updatedCart?.totalQuantity) &&
      priceCap <= Number(updatedCart?.cost.totalAmount.amount)
    ) {
      const difference = Math.abs(priceCap - Number(updatedCart?.cost.totalAmount.amount));
      if (difference < minDifference) {
        minDifference = difference;
        closestObject = obj;
      }
    }
  });

  return closestObject;
};

export const getTempId = () => {
  return `temp-${uuidv4()}`;
};
export const createCartItem = (tempId: any, product: any, variant: any) => {
  return {
    id: tempId,
    cost: {
      amountPerQuantity: {
        amount: variant.price.amount,
        currencyCode: variant.price.currencyCode
      },
      totalAmount: {
        amount: variant.price.amount * 1,
        currencyCode: variant.price.currencyCode
      }
    },
    quantity: 1,
    merchandise: {
      id: variant.id,
      price: {
        amount: variant.price.amount
      },
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        ...product,
        images: {
          edges: product.images
        },
        variants: {
          edges: product.variants
        }
      }
    }
  };
};

export const getCartData = (cart: Cart) => {
  const totalCost = cart?.lines?.reduce((acc: number, line: CartItem) => {
    const lineTotalAmount = Number(line.cost.amountPerQuantity.amount) * line.quantity;
    return acc + lineTotalAmount;
  }, 0);

  const cartTotalQuantity =
    cart?.lines?.reduce((acc: number, line: CartItem) => {
      const lineQuantity =
        Number(line?.cost?.amountPerQuantity?.amount) === 0 ? 0 : Number(line.quantity);
      return acc + lineQuantity;
    }, 0) || null;

  const cartTotalAmount = totalCost?.toFixed(2) || null;

  return {
    totalAmount: Number(cartTotalAmount),
    totalQuantity: Number(cartTotalQuantity),
    currencyCode: cart?.cost?.totalAmount?.currencyCode
  };
};

export function getReformedCoupons(metaObjects: any) {
  const transformedMetaObjects = metaObjects?.map((metaObject: any) => {
    const fieldsObject: Record<string, string> = {};
    metaObject?.fields?.forEach((field: any) => {
      fieldsObject[field.key ?? ''] = field.value ?? '';

      if (
        (field.key === 'applicable_products' ||
          field.key === 'free_products' ||
          field.key === 'gift') &&
        field.value
      ) {
        fieldsObject[field.key ?? ''] = JSON.parse(field.value) ?? '';
      }
    });
    return { ...metaObject, fields: fieldsObject };
  });
  return transformedMetaObjects;
}

export const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge: any) => edge?.node);
};

function isProductIdInArray(product: any, productList: any) {
  if (!product || !productList) {
    return false;
  }

  return productList.some((p: any) => p.id === product.id);
}
