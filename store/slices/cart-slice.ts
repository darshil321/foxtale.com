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
  loading: boolean;
  cart: Cart | any;
  quantities: any;
  error: any;
  metaObjects: any;
  giftCoupons?: GiftCoupon;
  freebieCoupons: FreebieCoupon;
  magicLinkCoupons: MagicLinkCoupon;
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

      // const data = current(state.cart);
      // console.log('newRmc3 incart', data, action);
    },
    addToCart: (state, action) => {
      const {
        payload: { product, selectedVariantId, tempId }
      } = action;

      const variant = getDefaultVariant(product, selectedVariantId);
      console.log('variant', variant);

      if (!variant) {
        console.log('Variant Not Found');
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
        console.log('cartLines not found');
        return;
      }
      state.cart = { ...cart.cart, lines: cartLines, totalQuantity: cart.cart.totalQuantity + 1 };
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
    setMagicLinkCoupons: (state, action) => {
      state.magicLinkCoupons = getReformedCoupons(action.payload);
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
  setMagicLinkCoupons
} = cartSlice.actions;
export default cartSlice.reducer;
