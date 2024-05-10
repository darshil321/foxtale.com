import { getCartItem, getDefaultVariant } from '@/lib/helper/helper';
import { createSlice, current } from '@reduxjs/toolkit';
import { Cart, CartItem } from 'lib/shopify/types';
// import { cookies } from 'next/headers';

export interface CartState {
  loading: boolean;
  cart: Cart | null;
  quantities: any;
  error: any;
  metaObjects: any;
}

export const initialState: CartState = {
  loading: false,
  cart: null,
  error: null,
  quantities: {},
  metaObjects: []
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

      // const data = current(state.cart);
      // console.log('newRmc3 incart', data, action);
    },
    addToCart: (state, action) => {
      const {
        payload: { product, selectedVariantId, tempId }
      } = action;

      const variant = getDefaultVariant(product, selectedVariantId);
      if (!variant) {
        console.log('Variant Not Found');
        return;
      }
      const cart = current(state);

      const productArray = cart.cart?.lines;

      const productFound = productArray?.find((item) => item.merchandise.id === variant.id);
      let cartLines;
      if (productFound) {
        cartLines = productArray?.map((line) => {
          if (line.id === productFound.id) {
            return {
              ...productFound,
              quantity: productFound.quantity + 1
            };
          } else {
            return line;
          }
        });
      } else {
        const cartItem = getCartItem(tempId, product);
        cartLines = [...productArray, cartItem];
      }

      let totQuant = 0;
      if (cart.cart) {
        totQuant = cart.cart.totalQuantity + 1;
      }
      state.cart = { ...cart.cart, lines: cartLines, totalQuantity: totQuant };

      // const _cart = current(state);
      // const magic_key = '234567';
      // const _product = getCoupon(_cart.metaObjects, _cart.cart, 'magic_link', magic_key);
      // console.log('_product', _product);
      // const isExist = cartLines?.find((item) => )
      // if (_product && ) {
      //   dispatch(addtocart)
      // }
    },

    attemptGetCarts: () => {
      //loading true
    },
    setCart: (state, action) => {
      const { tempId, ...res } = action.payload;
      const cartLines = res?.lines.map((cartItem: any) => {
        if (cartItem.id === tempId) {
          return { ...res };
        }
        return cartItem;
      });

      state.cart = { ...res, lines: cartLines as CartItem[] };
      const _cart = current(state);
      console.log('_cart', _cart);
    },

    updateCartItemQuantity: (state, action) => {
      const { itemId, newQuantity } = action.payload;
      if (!state.quantities) state.quantities = {};
      state.quantities[itemId] = newQuantity;
    },

    setMetaObject: (state, action) => {
      state.metaObjects = action.payload;
    }
  }
});

export const {
  getCartSuccess,
  setCart,
  getCartFailed,
  attemptGetCarts,
  updateCartItemQuantity,
  setMetaObject
} = cartSlice.actions;
export default cartSlice.reducer;
