import { createAction } from '@reduxjs/toolkit';

export const cartActions = {
  attemptGetCarts: createAction<{}>('cart/attemptGetcarts'),
  getCartFailed: createAction('cart/getCartFailed'),
  getCartSuccess: createAction('cart/getCartSuccess')
};
