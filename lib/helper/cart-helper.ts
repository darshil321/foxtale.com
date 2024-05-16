import { Cart, CartItem, Product } from '../shopify/types';
import { getCartData } from './helper';

export const getApplicableCoupon = (coupon: any, cart: any) => {
  if (!coupon.length) return null;

  let minDifference = Infinity;
  const applicableCoupon = coupon.reduce((acc: any, coupon: any) => {
    const { fields } = coupon;

    const buyXQuantity = parseInt(fields?.buy_x_quantity ?? '');
    const priceCap = parseInt(fields?.price_cap ?? '');

    const { totalAmount, totalQuantity }: any = getApplicableSubCart(
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
export const findVariant = (products: Product[], freeProduct: string) => {
  return products.find((product: Product) =>
    product?.variants?.some((variant: { id: string }) => variant.id === freeProduct)
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

const getApplicableSubCart = (cart: any, applicableProducts: any) => {
  if (!applicableProducts) return null;
  const applicableCart = cart?.lines?.filter((cartItem: any) => {
    const product = applicableProducts.find((item: any) => {
      return item === cartItem.merchandise.id;
    });
    if (product) {
      return true;
    }
    return false;
  });

  const { totalAmount, totalQuantity } = getCartData({ lines: applicableCart } as any);
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

export const getApplicableMagicLink = ({
  magicKey: key,
  coupons,
  cart,
  products
}: {
  magicKey: string;
  coupons: any;
  cart: any;
  products: any;
}) => {
  if (!key || !coupons.length || !cart) return null;

  const coupon = coupons?.find((c: any) => c.fields.magic_key === key);
  if (!coupon) {
    console.log('magic link not valid');
    return null;
  }

  const { fields } = coupon;

  //check if applicable collection
  let applicableProducts = [] as any;
  if (fields.applicable_collection) {
    const applicableCart = cart.lines.filter((line: any) => {
      const _product = findVariant(products, line.merchandise.id) as any;
      if (
        _product &&
        _product?.collections?.length &&
        _product?.collections.includes(fields.applicable_collection)
      ) {
        return true;
      }
    });
    applicableProducts = applicableCart.map((c: any) => c.merchandise.id);
  }

  //check if applicable product
  if (fields.applicable_products) {
    applicableProducts = [...applicableProducts, ...fields.applicable_products];
  }

  const { totalAmount, totalQuantity }: any = getApplicableSubCart(cart, applicableProducts);

  if (
    (!fields.cart_total || Number(fields.cart_total) <= totalAmount) &&
    fields.total_quantity &&
    Number(fields.total_quantity) <= totalQuantity
  ) {
    return coupon;
  }
  return null;
};
