import { createSlice } from '@reduxjs/toolkit';
import { Cart } from 'lib/shopify/types';

export interface CartState {
  loading: boolean;
  cart: Cart | null;
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

    getCartFailed: (state) => {
      // const data = current(state);
      state.loading = false;
    },

    attemptGetCarts: () => {
      //loading true
    },
    setCart: (state, action) => {
      console.log('incart', action.payload);

      state.cart = action.payload;
    },

    updateCartItemQuantity: (state, action) => {
      const { itemId, newQuantity } = action.payload;
      if (!state.quantities) state.quantities = {};
      state.quantities[itemId] = newQuantity;
    }
  }
});

export const { getCartSuccess, setCart, getCartFailed, attemptGetCarts, updateCartItemQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
