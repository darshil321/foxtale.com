import { createSlice, current } from '@reduxjs/toolkit';
import { Cart } from 'lib/shopify/types';
// import { cookies } from 'next/headers';

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

    //     addToCart: (state, action) => {
    //       const store = getState(state);
    //       //fetch cart from redux
    //       const cartProduct = state.cart;

    //       const isProductExist = cartProduct.find((p) => p.id === productId);

    //       if (isProductExist) {
    //         state = {
    //           ...state,
    //           cart: {
    //             ...state.cart,
    //             products: state.cart.product.map(p)=> {
    //                         if (p.id === payload.productId) {
    //                           return {
    //                               ...p,
    //                               quantity: p.quantity + payload.quantity
    //                           }
    //                         } else {
    //                           return p
    //                         }
    //             }

    //           }
    //        }
    //       } else {
    //      state = {
    //        ...state,
    //        cart: {
    //          ...state.cart,
    //          products = state.cart.products.push({...payload.products,quantity:payload.quantity})

    //        }

    //       }
    // }

    //     },

    getCartFailed: (state) => {
      // const data = current(state);
      state.loading = false;
    },
    removeCart: (state, action) => {
      const cart = current(state.cart);
      state.cart = {
        ...cart,
        lines: cart?.lines.filter((item) => item.id !== action.payload.lineId)
      };

      console.log('newRmc3 incart', state.cart, action.payload);

      // const data = current(state.cart);
      // console.log('newRmc3 incart', data, action);
    },
    addToCart: (state, action) => {
      const {
        payload: { selectedVariantId, product }
      } = action;
      const cart = current(state.cart);
      console.log(selectedVariantId, product, cart);
    },

    attemptGetCarts: () => {
      //loading true
    },
    setCart: (state, action) => {
      // console.log('newUp3 incart', data, action.payload);

      state.cart = action.payload;
      console.log('newUp3 incart', state.cart);
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
