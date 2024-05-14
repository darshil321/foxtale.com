import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { v4 as uuidv4 } from 'uuid';

import {
  getApplicableCoupon,
  getApplicableMagicLink,
  getFreeProduct,
  getFreeProductCartLines,
  getMagicKey,
  isFreeProductExistInCart,
  removableLineIds
} from '../helper/cart-helper';
import { cartActions } from '@/store/actions/cart.action';
// import { useDispatch } from 'react-redux';
// import { cartActions } from '@/store/actions/cart.action';

function useCoupon() {
  console.log('useCouponnnn');

  const cart = useAppSelector((state) => state.cart.cart);
  const freebies = useAppSelector((state) => state.cart.freebieCoupons) || [];
  const gifts = useAppSelector((state) => state.cart.giftCoupons) || [];
  const magicLinks = useAppSelector((state) => state.cart.magicLinkCoupons) || [];
  const collections = useAppSelector((state) => state.collections.collections) || [];
  const products = useAppSelector((state) => state.products.products) || [];
  const dispatch = useAppDispatch();

  // const products = useAppSelector((state) => state.products.products) || [];

  console.log('useCoupon', cart);

  // const dispatch = useDispatch();

  const getFreeProductsByCoupon = (cart: any) => {
    const magicKey = getMagicKey();

    let magicLinkCoupon, freebieCoupon, giftCoupon;
    if (magicKey) {
      console.log('magicccc', freebies);
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
      console.log('freebieCoupon', freebieCoupon, gifts, cart);
    }

    return { magicLinkCoupon, freebieCoupon, giftCoupon };
  };

  const adjustFreebiesInCart = (cart) => {
    const addedFreeProducts = getFreeProductCartLines(cart);
    let removableCartLineIds: any = [];

    // const cartWithoutFree = clearFreeProductsFromCart();
    console.log('cartsss', cart);

    const { freebieCoupon, giftCoupon, magicLinkCoupon } = getFreeProductsByCoupon(cart);

    console.log('adjusting', freebieCoupon);
    console.log('adjustFreebiesInCart', giftCoupon, magicLinkCoupon, freebieCoupon);
    if (magicLinkCoupon) {
      const { fields } = magicLinkCoupon;
      if (fields.applicable_product) {
        //applicable product cart chhe k nai .. product no data levano
        //check free products exists in cart or not and remove extra free products
        // dispatch(cartActions.addToCart());
      }
    } else {
      //check free products exists in cart or not and remove extra free products
      const freeProducts: any[] = [];

      freeProducts.push(freebieCoupon?.fields.free_product);
      removableCartLineIds = removableLineIds(addedFreeProducts, freeProducts);
      console.log('removableCartLineIds', removableCartLineIds);

      console.log('freebieCouponn', freebieCoupon);

      if (freebieCoupon) {
        const { fields } = freebieCoupon;
        if (fields.free_product) {
          const isAlreadyAdded = isFreeProductExistInCart(cart, fields.free_product);
          if (!isAlreadyAdded) {
            const product = getFreeProduct(products, fields.free_product);
            console.log('adding', fields.free_product, product);

            dispatch(
              cartActions.addToCart({
                selectedVariantId: fields.free_product,
                product: product,
                tempId: uuidv4()
              })
            );
          }
        }
      }

      if (giftCoupon) {
        const { fields } = giftCoupon;
        if (fields.applicable_product) {
          // dispatch(cartActions.addToCart());
        }
      }
    }
    return { removableCartLineIds };
  };

  // const isFree = (id) => {
  //   //check from 3 coupon's applicable free product
  //   return true;
  // };

  return {
    adjustFreebiesInCart
  };
}

export default useCoupon;
