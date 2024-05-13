import { getCartItem, getDefaultVariant, getReformedCoupons } from '@/lib/helper/helper';
import { createSlice, current } from '@reduxjs/toolkit';
import { Cart, CartItem } from 'lib/shopify/types';
interface Giftfield {
  applicable_product: string[];
  buy_x_quantity: string;
  coupon_code: string;
  gift: string[];
  price_cap: string;
}
interface Freebiefield {
  applicable_products: string[];
  buy_x_quantity: string;
  coupon_code: string;
  freebie: string[];
  price_cap: string;
}

interface GiftCoupon {
  fields: Giftfield[];
  id: string; // ID of the coupon
  type: string; // Type of coupon
}
interface FreebieCoupon {
  fields: Freebiefield[];
  id: string; // ID of the coupon
  type: string; // Type of coupon
}
export interface CartState {
  loading: boolean;
  cart: Cart | any;
  quantities: any;
  error: any;
  metaObjects: any;
  giftCoupons?: GiftCoupon;
  freebieCoupons: FreebieCoupon;
  isCartOpen: boolean;
}

export const initialState: CartState = {
  loading: false,
  cart: null,
  error: null,
  quantities: {},
  metaObjects: [],

  isCartOpen: false
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
    removeCart: (state, action) => {
      const cart = current(state.cart);
      state.cart = {
        ...cart,
        lines: cart?.lines.filter((item: any) => item.id !== action.payload.lineId)
      };
    },
    addToCart: (state, action) => {
      const {
        payload: { product, selectedVariantId, tempId }
      } = action;

      const variant = getDefaultVariant(product, selectedVariantId);

      if (!variant) {
        return;
      }

      const cart = current(state);

      const productArray = cart.cart?.lines || [];
      const productFound = productArray?.find((item: any) => item.merchandise.id === variant.id);

      let cartLines;
      if (productFound) {
        cartLines = productArray?.map((line: any) => {
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
        const cartItem = getCartItem(tempId, product, variant);
        cartLines = [...productArray, cartItem];
      }

      if (!cart.cart || !cart.cart.lines) {
        return;
      }
      state.cart = { ...cart.cart, lines: cartLines, totalQuantity: cart.cart.totalQuantity + 1 };
    },

    attemptGetCarts: () => {
      //loading true
    },
    setCart: (state, action) => {
      const { tempId, ...res } = action.payload;
      const cartLines: CartItem[] = res?.lines.map((cartItem: CartItem) => {
        if (cartItem.id === tempId) {
          return { ...res };
        }
        return cartItem;
      });
      // const filteredCartLines = cartLines.filter((cartItem) => cartItem.quantity > 0);
      state.cart = { ...res, lines: cartLines as CartItem[] };
    },

    updateCartItemQuantity: (state, action) => {
      const { itemId, newQuantity } = action.payload;
      if (!state.quantities) state.quantities = {};
      state.quantities[itemId] = newQuantity;
    },

    setMetaObject: (state, action) => {
      state.metaObjects = action.payload;
    },
    setGiftCoupons: (state, action) => {
      state.giftCoupons = getReformedCoupons(action.payload);
    },
    setFreebieCoupons: (state, action) => {
      state.freebieCoupons = getReformedCoupons(action.payload);
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    }
  }
});

export const {
  getCartSuccess,
  setCart,
  getCartFailed,
  attemptGetCarts,
  updateCartItemQuantity,
  setMetaObject,
  setGiftCoupons,
  setFreebieCoupons,
  setCartOpen,
  removeCart,
  addToCart
} = cartSlice.actions;
export default cartSlice.reducer;
