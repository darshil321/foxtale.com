import { useAppSelector } from '@/store/hooks';
import { getCartData, getMagicLink } from '../helper/helper';
import { useEffect } from 'react';

function useCoupon() {
  const cart = useAppSelector((state) => state.cart.cart);
  const freebies = useAppSelector((state) => state.cart.freebieCoupons) || [];
  const gifts = useAppSelector((state) => state.cart.giftCoupons) || [];
  console.log('freebies', freebies, gifts);
  const getFreebiesProduct = (freebies, cart) => {
    console.log(2);
    if (!freebies.length) return null;
    freebies.map((freebie) => {
      const { applicable_products } = freebie;
      const res = getApplicableSubCart(cart, applicable_products);
      console.log('applicableCart', res);
    });
  };

  const getApplicableSubCart = (cart, applicableProducts) => {
    console.log(3);
    const applicableCart = cart.lines.filter((cartItem) => {
      const product = applicableProducts.find((item) => item.id === cartItem.merchandise.id);
      if (product) {
        return true;
      }
      return false;
    });
    console.log('applicableCart', applicableCart);
    const { totalAmount, totalQuantity } = getCartData(applicableCart);
    return {
      totalAmount,
      totalQuantity
    };
  };

  const magicLink = getMagicLink();
  const getFreeProductsByCoupon = () => {
    if (magicLink && false) {
    } else {
      // const coupon = findClosestCoupon(freebies, cart);
      const freeProduct = getFreebiesProduct(freebies, cart);
      console.log('freeProduct', freeProduct);
    }
  };
  useEffect(() => {
    console.log(1);
    getFreeProductsByCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freebies, cart]);

  return {
    getFreeProductsByCoupon
  };
}

export default useCoupon;
