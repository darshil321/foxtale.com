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

const getApplicableSubCart = (cart, applicableProducts) => {
  if (!applicableProducts) return null;
  const applicableCart = cart.lines.filter((cartItem) => {
    const product = applicableProducts.find((item) => item === cartItem.merchandise.id);
    if (product) {
      return true;
    }
    return false;
  });

  const { totalAmount, totalQuantity } = getCartData({ lines: applicableCart });
  return {
    totalAmount,
    totalQuantity
  };
};

export const getMagicKey = () => {
  return '234567';
};

export const getApplicableMagicLink = ({ magicKey: key, coupons, cart, collections }) => {
  if (!key || !coupons.length) return null;

  const coupon = coupons.find((c: any) => c.fields.magic_key === key);
  if (!coupon) {
    console.log('magic link not valid');
    return null;
  }
  const { fields } = coupon;

  //check if already added
  const isAlreadyAdded = cart.lines.some((line) => line.merchandise.id === fields.free_product);
  if (isAlreadyAdded) return null;

  //check if applicable collection
  let applicableProducts = [];
  if (fields.applicable_collection) {
    const collection = collections.find((c) => c.id === fields.applicable_collection);
    if (collection) {
      const _products = removeEdgesAndNodes(collection.products);
      if (_products) applicableProducts = _products.map((p) => p.id) || [];
    }
  }

  //check if applicable product
  if (fields.applicable_products) {
    applicableProducts = [...applicableProducts, ...fields.applicable_products];
  }

  const { totalAmount, totalQuantity } = getApplicableSubCart(cart, applicableProducts);

  if (
    (!fields.cart_total || Number(fields.cart_total) <= totalAmount) &&
    fields.total_quantity &&
    Number(fields.total_quantity) <= totalQuantity
  ) {
    return coupon;
  }
  return null;
};
