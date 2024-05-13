import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { getApplicableCoupon, getApplicableMagicLink, getMagicKey } from '../helper/cart-helper';
// import { cartActions } from '@/store/actions/cart.action';
// import { v4 as uuidv4 } from 'uuid';
// import { useDispatch } from 'react-redux';

function useCoupon() {
  const cart = useAppSelector((state) => state.cart.cart);
  const freebies = useAppSelector((state) => state.cart.freebieCoupons) || [];
  const gifts = useAppSelector((state) => state.cart.giftCoupons) || [];
  const magicLinks = useAppSelector((state) => state.cart.magicLinkCoupons) || [];
  const collections = useAppSelector((state) => state.collections.collections) || [];
  // const products = useAppSelector((state) => state.products.products) || [];

  // const dispatch = useDispatch();

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
    console.log('magicLinkCoupon', magicLinkCoupon);
    if (magicLinkCoupon) {
      const { fields } = magicLinkCoupon;
      if (fields.free_product) {
        // const product = getApplicableProduct(products, fields.free_product);

        const isExist = cart.lines.some((c) => c.merchandise.id === fields.free_product);

        if (!isExist) {
        }
        // dispatch(
        //   cartActions.addToCart({
        //     selectedVariantId: fields.free_product,
        //     product,
        //     tempId: uuidv4()
        //   })
        // );
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

  // const getApplicableProduct = (products: any, id: string) => {
  //   const product = products.find((product: any) => {
  //     if (product.variants) {
  //       const variant = product.variants.find((v) => {
  //         return v.id === id;
  //       });

  //       if (variant) return true;
  //     }
  //   });

  //   return product;
  // };

  useEffect(() => {
    adjustFreebiesInCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  return {};
}

export default useCoupon;
