import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { getApplicableCoupon, getApplicableMagicLink, getMagicKey } from '../helper/cart-helper';
// import { useDispatch } from 'react-redux';
// import { cartActions } from '@/store/actions/cart.action';

function useCoupon() {
  const cart = useAppSelector((state) => state.cart.cart);
  const freebies = useAppSelector((state) => state.cart.freebieCoupons) || [];
  const gifts = useAppSelector((state) => state.cart.giftCoupons) || [];
  const magicLinks = useAppSelector((state) => state.cart.magicLinkCoupons) || [];
  const collections = useAppSelector((state) => state.collections.collections) || [];
  // const products = useAppSelector((state) => state.products.products) || [];

  console.log('cart', cart);

  // const dispatch = useDispatch();

  const getFreeProductsByCoupon = (cart: any) => {
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
    const cartWithoutFree = clearFreeProductsFromCart();
    const { freebieCoupon, giftCoupon, magicLinkCoupon } = getFreeProductsByCoupon(cartWithoutFree);
    console.log('first', magicLinkCoupon);
    if (magicLinkCoupon) {
      const { fields } = magicLinkCoupon;
      if (fields.applicable_product) {
        //applicable product cart chhe k nai .. product no data levano
        //check free products exists in cart or not and remove extra free products
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

  // const isFree = (id) => {
  //   //check from 3 coupon's applicable free product
  //   return true;
  // };
  const clearFreeProductsFromCart = () => {
    // const items = cart.lines.filter((line) => !(line.price === 0 && isFree(line.merchandise.id))
    //remove these items
  };

  useEffect(() => {
    adjustFreebiesInCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  return {
    adjustFreebiesInCart
  };
}

export default useCoupon;
