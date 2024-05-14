import { Cart, CartItem, Product } from '../shopify/types';
import { getCartData, removeEdgesAndNodes } from './helper';

export const getApplicableCoupon = (coupon, cart) => {
  if (!coupon.length) return null;

  let minDifference = Infinity;
  const applicableCoupon = coupon.reduce((acc, coupon) => {
    const { fields } = coupon;

    const buyXQuantity = parseInt(fields?.buy_x_quantity ?? '');
    const priceCap = parseInt(fields?.price_cap ?? '');

    const { totalAmount, totalQuantity } = getApplicableSubCart(
      cart,
      fields['applicable_products']
    );

    if (buyXQuantity <= totalQuantity && priceCap <= totalAmount) {
      const difference = Math.abs(priceCap - Number(totalAmount));

      if (difference < minDifference) {
        minDifference = difference;
        acc = coupon;
      }
    }

    return acc;
  }, null);

  return applicableCoupon;
};
export const isFreeProductExistInCart = (cart: any, freeProduct: string | string[]) => {
  const { lines } = cart;
  if (Array.isArray(freeProduct)) {
    return freeProduct.some((product: string) =>
      lines.some((line: any) => line.merchandise.id === product)
    );
  } else {
    return lines.some((line: any) => line.merchandise.id === freeProduct);
  }
};
export const getFreeProduct = (products: Product[], freeProduct: string) => {
  return products.find((product: Product) =>
    product.variants.some((variant: { id: string }) => variant.id === freeProduct)
  );
};
export const getFreeProductCartLines = (cart: Cart) => {
  const { lines } = cart;
  return lines?.filter((line: CartItem) => Number(line.cost.amountPerQuantity.amount) === 0);
};

export const getCartWithoutFreeProduct = (cart: Cart) => {
  const { lines } = cart;
  const cartLine = lines?.map((line: CartItem) => {
    if (Number(line.cost.amountPerQuantity.amount) === 0) return { ...line, quantity: 0 };
    return line;
  });
  return { ...cart, lines: cartLine };
};

export const removableLineIds = (cartItem: CartItem[] | undefined, freeProducts: string[]) => {
  const removableCartLines = cartItem?.filter(
    (product) => !freeProducts.includes(product.merchandise.id)
  );
  return removableCartLines?.map((line) => line.id);
};

const getApplicableSubCart = (cart, applicableProducts) => {
  if (!applicableProducts) return null;
  const applicableCart = cart?.lines?.filter((cartItem) => {
    const product = applicableProducts.find((item) => {
      return item === cartItem.merchandise.id;
    });
    if (product) {
      return true;
    }
    return false;
  });

  const { totalAmount, totalQuantity } = getCartData({ lines: applicableCart });
  return {
    totalAmount,
    totalQuantity,
    applicableCart
  };
};

export const getMagicKey = () => {
  const url = window.location.href;
  const searchParams = new URLSearchParams(new URL(url).search);
  const magicKey = searchParams.get('magicKey');
  return magicKey;
};

export const getApplicableMagicLink = ({ magicKey: key, coupons, cart, collections }) => {
  if (!key || !coupons.length || !cart) return null;

  const coupon = coupons.find((c: any) => c.fields.magic_key === key);
  if (!coupon) {
    console.log('magic link not valid');
    return null;
  }
  const { fields } = coupon;

  //check if applicable collection
  let applicableProducts = [];
  if (fields.applicable_collection) {
    const collection = collections.find((c) => c.id === fields.applicable_collection);
    if (collection) {
      const _products = removeEdgesAndNodes(collection.products);
      if (!_products.length) return null;
      const variants = _products
        .map((p) => removeEdgesAndNodes(p.variants).map((v) => v.id))
        .flat();

      if (variants) applicableProducts = variants || [];
    }
  }

  //check if applicable product
  if (fields.applicable_products) {
    applicableProducts = [...applicableProducts, ...fields.applicable_products];
  }

  const { totalAmount, totalQuantity } = getApplicableSubCart(cart, applicableProducts);

  console.log(
    'first',
    fields.cart_total,
    Number(fields.cart_total),
    totalAmount,
    fields.total_quantity,
    Number(fields.total_quantity),
    totalQuantity
  );
  if (
    (!fields.cart_total || Number(fields.cart_total) <= totalAmount) &&
    fields.total_quantity &&
    Number(fields.total_quantity) <= totalQuantity
  ) {
    return coupon;
  }
  return null;
};
