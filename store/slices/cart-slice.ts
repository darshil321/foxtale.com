import { createSlice, current } from '@reduxjs/toolkit';

export interface CartState {
  loading: boolean;
  cart: any;
  quantities: any;
  error: any;
}

export const initialState: CartState = {
  loading: false,
  cart: null,
  error: null,
  quantities: {}
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    getCartSuccess: (state, action) => {
      const { products } = action.payload.body.data;
      state.cart = products.edges;
      // Initialize quantities with default values or from cart items
      products.edges.forEach((item: any) => {
        state.quantities[item.id] = item.quantity; // Assuming each item has an 'id' and 'quantity'
      });
    },

    getCartFailed: (state, action) => {
      const data = current(state);
      console.log('failed reducer:>> ', data, action);
      state.loading = false;
    },

    attemptGetCarts: (state, action) => {
      console.log('attempt product reducer :>> ', action);
      //loading true
    },

    updateCartItemQuantity: (state, action) => {
      const { itemId, newQuantity } = action.payload;
      if (!state.quantities) state.quantities = {};
      state.quantities[itemId] = newQuantity;
    }
  }
});

export const { getCartSuccess, getCartFailed, attemptGetCarts, updateCartItemQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
