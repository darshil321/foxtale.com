import { useAppSelector } from '@/store/hooks';
import { getCartData, getMagicLink } from '../helper/helper';
import { useEffect } from 'react';

function useCoupon() {
  const cart = useAppSelector((state) => state.cart.cart);
  const freebies = useAppSelector((state) => state.cart.freebieCoupons) || [];
  const gifts = useAppSelector((state) => state.cart.giftCoupons) || [];
  console.log(gifts);

  const getFreebiesProduct = (freebies, cart) => {
    if (!freebies.length) return null;
    freebies.map((freebie) => {
      const { applicable_products } = freebie;
      const res = getApplicableSubCart(cart, applicable_products);
      console.log(res);
    });
  };

  const getApplicableSubCart = (cart, applicableProducts) => {
    const applicableCart = cart.lines.filter((cartItem) => {
      const product = applicableProducts.find((item) => item.id === cartItem.merchandise.id);
      if (product) {
        return true;
      }
      return false;
    });
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
      console.log(freeProduct);
    }
  };
  useEffect(() => {
    getFreeProductsByCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freebies, cart]);

  return {
    getFreeProductsByCoupon
  };
}

export default useCoupon;
