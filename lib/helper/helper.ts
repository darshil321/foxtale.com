import axios from 'axios';

export function debounce(func: any, delay: any) {
  let timeoutId: any;

  return function () {
    // const context = this;
    // const args = arguments;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      // func.apply(context, args);
    }, delay);
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
