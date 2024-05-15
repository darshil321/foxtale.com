import { getCartItem, getDefaultVariant, getReformedCoupons } from '@/lib/helper/helper';
import { createSlice, current } from '@reduxjs/toolkit';
import { Cart } from 'lib/shopify/types';
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

interface MagicLinkFields {
  applicable_products: string[];
  applicable_collection: string[];
  cart_total: number;
  magic_key: string;
  free_product: string[];
  total_quantity: string;
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
interface MagicLinkCoupon {
  fields: MagicLinkFields[];
  id: string;
  type: string;
}
export interface CartState {
  getCartLoading: boolean;
  addToCartLoading: boolean;
  updateCartLoading: boolean;
  removeCartLoading: boolean;
  cart: Cart | any;
  quantities: any;
  error: any;
  metaObjects: any;
  giftCoupons?: GiftCoupon;
  freebieCoupons?: FreebieCoupon;
  magicLinkCoupons?: MagicLinkCoupon;
  isCartOpen: boolean;
}

export const initialState: CartState = {
  getCartLoading: false,
  addToCartLoading: false,
  updateCartLoading: false,
  removeCartLoading: false,

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
    getCartSuccess: () => {
      // const { products } = action.payload.body.data;
      // state.cart = products.edges;
      // // Initialize quantities with default values or from cart items
      // products.edges.forEach((item: any) => {
      //   state.quantities[item.id] = item.quantity; // Assuming each item has an 'id' and 'quantity'
      // });
    },
    getCartFailed: (state) => {
      // const data = current(state);
      state.getCartLoading = false;
    },
    removeCart: (state, action) => {
      const cart = current(state.cart);
      const lineIds = action.payload.lineIds;
      console.log('lineIds', lineIds);

      state.cart = {
        ...cart,
        lines: cart?.lines.filter((item: any) => !lineIds?.includes(item.id))
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

      if (!cart.cart) {
        state.cart = { lines: cartLines, totalQuantity: 1 };
      } else {
        state.cart = { ...cart.cart, lines: cartLines, totalQuantity: cart.cart.totalQuantity + 1 };
      }
    },

    attemptGetCart: () => {
      //loading true
    },

    setCart: (state, action) => {
      console.log('setCart', action.payload);

      state.cart = action.payload;
      // const _state = current(state);

      // const { tempId, ...rest } = action.payload;
      // console.log('rest', action.payload);

      // const res = rest.data;
      // console.log('res', action);

      // let cartLines = res?.lines;
      // if (tempId) {
      //   cartLines = res?.lines.map((cartItem: CartItem) => {
      //     if (cartItem.id === tempId) {
      //       return { ...res };
      //     }
      //     return cartItem;
      //   });
      // }

      // state.cart = { ...res, lines: cartLines as CartItem[] };
      // console.log('state.cart', state.cart);
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
    setMagicLinkCoupons: (state, action) => {
      state.magicLinkCoupons = getReformedCoupons(action.payload);
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    setAddToCartLoading: (state, action) => {
      state.addToCartLoading = action.payload;
    },
    setUpdateCartLoading: (state, action) => {
      state.updateCartLoading = action.payload;
    },
    setRemoveCartLoading: (state, action) => {
      state.removeCartLoading = action.payload;
    }
  }
});

export const {
  getCartSuccess,
  setCart,
  getCartFailed,
  attemptGetCart,
  setMetaObject,
  setGiftCoupons,
  setFreebieCoupons,
  setCartOpen,
  removeCart,
  addToCart,
  setMagicLinkCoupons,
  setAddToCartLoading,
  setUpdateCartLoading,
  setRemoveCartLoading
} = cartSlice.actions;
export default cartSlice.reducer;
