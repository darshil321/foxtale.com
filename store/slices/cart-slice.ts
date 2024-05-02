import { createSlice, current } from '@reduxjs/toolkit';

export interface CartState {
  loading: boolean;
  cart: any;

  error: any;
}

export const initialState: CartState = {
  loading: false,
  cart: null,
  error: null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    getCartSuccess: (state, action) => {
      const { products } = action.payload.body.data;
      state.cart = products.edges;
      console.log('success reducer:>> ', products);
    },

    getCartFailed: (state, action) => {
      const data = current(state);
      console.log('failed reducer:>> ', data, action);
      state.loading = false;
    },

    attemptGetCarts: (state, action) => {
      console.log('attempt product reducer :>> ', action);
      //loading true
    }
  }
});

export const { getCartSuccess, getCartFailed, attemptGetCarts } = cartSlice.actions;
export default cartSlice.reducer;
