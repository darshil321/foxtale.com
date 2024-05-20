import {
  createCartItem,
  getDefaultVariant,
  getReformedCoupons,
  getTempId
} from '@/lib/helper/helper';
import { createSlice, current } from '@reduxjs/toolkit';
import { Cart, Product } from 'lib/shopify/types';
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
  loading: boolean;

  cart: Cart | any;
  quantities: any;
  error: any;
  metaObjects: any;
  giftCoupons?: GiftCoupon;
  freebieCoupons?: FreebieCoupon;
  magicLinkCoupons?: MagicLinkCoupon;
  recommendedProducts?: Product[];
  isCartOpen: boolean;
  giftFreeProducts?: { product: Product; variantId: string }[];
  remoteCart?: Cart;
}

export const initialState: CartState = {
  getCartLoading: false,
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
    getCartFailed: (state) => {
      // const data = current(state);
      state.getCartLoading = false;
    },
    removeCart: (state, action) => {
      const { lineIds } = action.payload;
      const cart = current(state.cart);

      state.cart = {
        ...cart,
        lines: cart?.lines.filter((item: any) => !lineIds?.includes(item.id))
      };
    },

    addToCart: (state, action) => {
      const { product, selectedVariantId } = action.payload;

      const variant = getDefaultVariant(product, selectedVariantId);

      if (!variant) {
        console.log('No product found');
        return;
      }

      const cart = current(state).cart;

      const existingCartLines = cart?.lines || [];

      // Check if the product variant is already in the cart
      const productIndex = existingCartLines.findIndex(
        (item: any) => item.merchandise.id === variant.id
      );

      let updatedCartLines;
      if (productIndex !== -1) {
        // If the product variant is found, update its quantity
        updatedCartLines = existingCartLines.map((line: any, index: number) =>
          index === productIndex ? { ...line, quantity: line.quantity + 1 } : line
        );
      } else {
        // If the product variant is not found, add it as a new item
        const newCartItem = createCartItem(getTempId(), product, variant);
        updatedCartLines = [...existingCartLines, newCartItem];
      }

      // Update the cart state with the new lines and total quantity
      const totalQuantity = (cart?.totalQuantity || 0) + 1;
      state.cart = { lines: updatedCartLines, totalQuantity };
    },

    updateCartItem: (state, action) => {
      const { productId, quantity } = action.payload;

      const cart = current(state).cart;
      if (!cart) {
        console.log('Cart not found');
        return;
      }

      let cartLines = cart.lines || [];
      const productIndex = cartLines.findIndex((item: any) => item.merchandise.id === productId);

      if (productIndex === -1) {
        console.log('Product not found');
        return;
      }

      if (quantity === 0) {
        // Remove the item if quantity is zero
        cartLines = cartLines.filter((item: any) => item.merchandise.id !== productId);
      } else {
        // Update the quantity of the product
        cartLines = cartLines.map((line: any, index: number) =>
          index === productIndex ? { ...line, quantity } : line
        );
      }

      state.cart = { ...cart, lines: cartLines };
    },

    manageCartSuccess: (state, action) => {
      const cartRes = action.payload;
      const cart = current(state).cart;

      if (!cart?.lines?.length) {
        return;
      }

      const cartLines = cart?.lines?.map((line: any) => {
        const isExist = cartRes.lines.find(
          (cartLine: any) => cartLine.merchandise.id === line.merchandise.id
        );
        return isExist ? { ...line, id: isExist.id } : line;
      });

      state.cart = { ...cart, id: cartRes.id, lines: cartLines };
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setRecommendedProduct: (state, action) => {
      state.recommendedProducts = action.payload;
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setGiftFreeProducts: (state, action) => {
      state.giftFreeProducts = action.payload;
    }
  }
});

export const {
  setCart,
  manageCartSuccess,
  getCartFailed,
  setMetaObject,
  setGiftCoupons,
  setFreebieCoupons,
  setCartOpen,
  removeCart,
  setRecommendedProduct,
  setLoading,
  addToCart,
  setMagicLinkCoupons,

  updateCartItem,
  setGiftFreeProducts
} = cartSlice.actions;
export default cartSlice.reducer;
