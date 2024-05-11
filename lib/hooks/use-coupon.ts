// import { useAppSelector } from '@/store/hooks';
import { getMagicLink } from '../helper/helper';
import { useEffect } from 'react';

function useCoupon() {
  //   const cart = useAppSelector((state) => state.cart.cart);
  //   const metaObject = useAppSelector((state) => state.cart.cart) || [];

  const magicLink = getMagicLink();

  useEffect(() => {
    console.log(1111111);
  });
  const getFreeProductsByCoupon = () => {
    if (magicLink) {
    } else {
      //    const coupon = findClosestCoupon(metaObject, cart);
    }
  };

  return {
    getFreeProductsByCoupon
  };
}

export default useCoupon;
