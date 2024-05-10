import { getCoupon } from '@/lib/helper/helper';
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
        payload: { product, tempId }
      } = action;

      const cart = current(state);

      const productArray = cart.cart?.lines;
      const productFound = productArray?.find(
        (item) => item.merchandise.id === product.variants.id
      );
      console.log('window.location.href', window.location.href);
      let cartItem;
      if (productFound) {
        if (cart.cart && cart.cart.totalQuantity !== undefined) {
          // productFound.quantity += 1;
          // cart.cart.totalQuantity += 1;
          console.log('Reaching here');
          cartItem = {
            ...productFound,
            quantity: productFound.quantity + 1
          };
        }
      } else {
        cartItem = {
          id: tempId,
          cost: {
            amountPerQuantity: {
              amount: product.variants[0].price.amount,
              currencyCode: product.variants[0].price.currencyCode
            },
            totalAmount: {
              amount: product.variants[0].price.amount,
              currencyCode: product.variants[0].price.currencyCode
            }
          },
          quantity: 1,
          merchandise: {
            id: product.variants.id,
            price: {
              amount: product.variants[0].price.amount
            },
            title: product.variants[0].title,
            selectedOptions: product.variants[0].selectedOptions,
            product: {
              ...product,
              images: {
                edges: product.images
              },
              variants: {
                edges: product.variants
              }
            }
          }
        };
      }
      let arr: any = [];
      let totQuant = 0;
      if (cart.cart) {
        arr = [...cart.cart.lines, cartItem];
        totQuant = cart.cart.totalQuantity + 1;
      }
      state.cart = { ...cart.cart, lines: arr, totalQuantity: totQuant };
      const _cart = current(state);
      console.log('_cart.cart', _cart.cart);
      console.log('window.location.href', window.location.href);
      getCoupon(_cart.metaObjects, _cart);
    },

    attemptGetCarts: () => {
      //loading true
    },
    setCart: (state, action) => {
      const { tempId, ...res } = action.payload;
      const cartState = current(state);
      const cartLines = res?.lines.map((cartItem: any) => {
        if (cartItem.id === tempId) {
          return { ...res };
        }
        return cartItem;
      });

      console.log('cartState', cartState, res);
      console.log('state.cart', state.cart);
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
