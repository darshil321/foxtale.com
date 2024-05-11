import { getMagicLink } from '../helper/helper';
import { useEffect } from 'react';

function useCoupon() {
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
