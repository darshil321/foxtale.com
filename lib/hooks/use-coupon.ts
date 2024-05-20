import { useAppSelector } from '@/store/hooks';

import {
  findVariant,
  getApplicableCoupon,
  getApplicableMagicLink,
  getFreeCartProduct,
  getFreeProductCartLines,
  getMagicKey,
  isFreeProductExistInCart,
  removableFreeProducts
} from '../helper/cart-helper';

function useCoupon() {
  const freebies = useAppSelector((state) => state.cart.freebieCoupons) || [];
  const gifts = useAppSelector((state) => state.cart.giftCoupons) || [];
  const magicLinks = useAppSelector((state) => state.cart.magicLinkCoupons) || [];
  const products = useAppSelector((state) => state.products.products) || [];

  const getUpdatedCart = (freeProducts: any, cart: any) => {
    const addedFreeProducts = getFreeProductCartLines(cart);
    let updatedCart = { ...cart };
    const itemsToBeAdd = [] as any;
    const removableCartLineIds = removableFreeProducts(addedFreeProducts, freeProducts);

    const cartLines = cart.lines.filter(
      (line: any) => !removableCartLineIds?.includes(line.merchandise.id)
    );
    updatedCart = { ...cart, lines: cartLines };

    if (freeProducts.length) {
      freeProducts.forEach((product: any) => {
        const isAlreadyAdded = isFreeProductExistInCart(updatedCart, product);
        if (!isAlreadyAdded) {
          const _product = findVariant(products, product);
          if (_product) itemsToBeAdd.push({ product: _product, variantId: product });
        }
      });
    }

    return { itemsToBeRemove: removableCartLineIds, itemsToBeAdd };
  };

  const getFreeProductsByCoupon = (cart: any) => {
    const magicKey = getMagicKey();

    let magicLinkCoupon, freebieCoupon, giftCoupon;
    if (magicKey) {
      magicLinkCoupon = getApplicableMagicLink({
        magicKey,
        coupons: magicLinks,
        cart,
        products
      });
    } else {
      //freebie

      freebieCoupon = getApplicableCoupon(freebies, cart);

      //gift
      giftCoupon = getApplicableCoupon(gifts, cart);
    }

    return { magicLinkCoupon, freebieCoupon, giftCoupon };
  };

  const adjustCart = (cart: any) => {
    const res = {
      freebiesToBeAdd: [],
      freebiesToBeRemove: [],
      giftProducts: []
    };
    const { freebieCoupon, giftCoupon, magicLinkCoupon } = getFreeProductsByCoupon(cart);

    if (!freebieCoupon && !giftCoupon && !magicLinkCoupon)
      return {
        ...res,
        freebiesToBeRemove: getFreeCartProduct(cart)
      };

    if (magicLinkCoupon) {
      if (magicLinkCoupon.fields.free_product) {
        const { itemsToBeRemove, itemsToBeAdd } = getUpdatedCart(
          [magicLinkCoupon.fields.free_product],
          cart
        );

        res.freebiesToBeAdd = itemsToBeAdd;
        res.freebiesToBeRemove = itemsToBeRemove as any;
      }
    } else {
      if (freebieCoupon) {
        const { itemsToBeRemove, itemsToBeAdd } = getUpdatedCart(
          [freebieCoupon.fields.free_product],
          cart
        );
        res.freebiesToBeAdd = itemsToBeAdd;
        res.freebiesToBeRemove = itemsToBeRemove as any;
      }

      if (giftCoupon) {
        const { fields } = giftCoupon;
        if (fields.free_products) {
          const giftProducts = fields.free_products.map((product: any) => ({
            product: findVariant(products, product),
            variantId: product
          }));

          res.giftProducts = giftProducts.filter((item: any) => Boolean(item.product));
        }
      }
    }
    return res;
  };

  return {
    adjustCart
  };
}

export default useCoupon;
