import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { getApplicableCoupon, getApplicableMagicLink, getMagicKey } from '../helper/cart-helper';

function useCoupon() {
  const cart = useAppSelector((state) => state.cart.cart);
  const freebies = useAppSelector((state) => state.cart.freebieCoupons) || [];
  const gifts = useAppSelector((state) => state.cart.giftCoupons) || [];
  const magicLinks = useAppSelector((state) => state.cart.magicLinkCoupons) || [];
  const collections = useAppSelector((state) => state.collections.collections);

  const getFreeProductsByCoupon = () => {
    const magicKey = getMagicKey();

    let magicLinkCoupon, freebieCoupon, giftCoupon;
    if (magicKey) {
      magicLinkCoupon = getApplicableMagicLink({
        magicKey,
        coupons: magicLinks,
        cart,
        collections
      });
    } else {
      //freebie
      freebieCoupon = getApplicableCoupon(freebies, cart);

      //gift
      giftCoupon = getApplicableCoupon(gifts, cart);
    }

    return { magicLinkCoupon, freebieCoupon, giftCoupon };
  };

  const adjustFreebiesInCart = () => {
    const { freebieCoupon, giftCoupon, magicLinkCoupon } = getFreeProductsByCoupon();
    if (magicLinkCoupon) {
      const { fields } = magicLinkCoupon;
      if (fields.applicable_product) {
        // dispatch(cartActions.addToCart());
      }
    } else {
      if (freebieCoupon) {
        const { fields } = freebieCoupon;
        if (fields.applicable_product) {
          // dispatch(cartActions.addToCart());
        }
      }

      if (giftCoupon) {
        const { fields } = giftCoupon;
        if (fields.applicable_product) {
          // dispatch(cartActions.addToCart());
        }
      }
    }
  };
  useEffect(() => {
    adjustFreebiesInCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  return {};
}

export default useCoupon;
