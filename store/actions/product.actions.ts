import { createAction } from '@reduxjs/toolkit';

export const productActions = {
  attemptGetProducts: createAction<{}>('products/attemptGetProducts'),
  getProductFailed: createAction('products/getProductFailed'),
  getProductSuccess: createAction('products/getProductSuccess')
};
