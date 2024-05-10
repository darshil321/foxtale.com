/* eslint-disable no-unused-vars */

import axios from 'axios';

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
    console.log('error', error);
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
}

async function getRatings() {
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
    console.log('cartItems', cartItems);
    const { totalQuantity } = cart;
    if (offerObj.total_quantity > totalQuantity) {
      return;
    }

    const freeProduct = magicArray.find((obj: any) => {
      if (obj.applicable_product) {
        const product = cartItems?.find(
          (item: any) => item.merchandise.product.id === obj.applicable_product
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
