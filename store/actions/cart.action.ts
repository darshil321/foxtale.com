import { createAction } from '@reduxjs/toolkit';

export const cartActions = {
  attemptGetCarts: createAction<{}>('cart/attemptGetcart'),
  getCartFailed: createAction('cart/getCartFailed'),
  getCartSuccess: createAction('cart/getCartSuccess'),
  addToCart: createAction<{}>('cart/addToCart'),
  updateCart: createAction<{}>('cart/updateCart'),
  removeCart: createAction<{}>('cart/removeCart'),
  setCart: createAction<{}>('cart/setCart'),
  setMetaObject: createAction<{}>('cart/setMetaObject'),
  setRecommendedProduct: createAction<{}>('cart/getRecommendedProducts')
};
