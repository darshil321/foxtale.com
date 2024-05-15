import { useAppSelector } from '@/store/hooks';

import {
  findVariant,
  getApplicableCoupon,
  getApplicableMagicLink,
  getCartWithoutFreeProduct,
  getFreeProductCartLines,
  getMagicKey,
  isFreeProductExistInCart,
  removableLineIds
} from '../helper/cart-helper';
import { useDispatch } from 'react-redux';
import { cartActions } from '@/store/actions/cart.action';
import { setGiftFreeProducts, setUpdateCartLoading } from '@/store/slices/cart-slice';
import { useMemo } from 'react';
import { debounce } from '../helper/helper';
import { v4 as uuidv4 } from 'uuid';

function useCoupon() {
  const freebies = useAppSelector((state) => state.cart.freebieCoupons) || [];
  const cartState = useAppSelector((state) => state.cart.cart);

  const gifts = useAppSelector((state) => state.cart.giftCoupons) || [];
  const magicLinks = useAppSelector((state) => state.cart.magicLinkCoupons) || [];
  const products = useAppSelector((state) => state.products.products) || [];

  const dispatch = useDispatch();
  const getUpdatedCart = (freeProducts: any, cart: any) => {
    const addedFreeProducts = getFreeProductCartLines(cart);
    let updatedCart = { ...cart };
    const itemsToBeAdd = [] as any;
    const removableCartLineIds = removableLineIds(addedFreeProducts, freeProducts);

    const cartLines = cart.lines.map((line: any) => {
      if (removableCartLineIds?.includes(line.merchandise.id)) {
        return { ...line, quantity: 0 };
      }
      return line;
    });
    updatedCart = { ...cart, lines: cartLines };

    if (freeProducts.length) {
      freeProducts.forEach((product: any) => {
        const isAlreadyAdded = isFreeProductExistInCart(cart, product);
        if (!isAlreadyAdded) {
          const _product = findVariant(products, product);
          if (_product) itemsToBeAdd.push({ product: _product, variantId: product });
        }
      });
    }

    return { updatedCart, itemsToBeAdd };
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

  const adjustFreebiesInCart = (cart: any) => {
    const res = {
      cartToBeUpdate: cart,
      itemsToBeAdd: [] as any,
      giftProducts: []
    };

    const { freebieCoupon, giftCoupon, magicLinkCoupon } = getFreeProductsByCoupon(cart);
    console.log('freebieCoupon', freebieCoupon);

    console.log('magicLinkCoupon', magicLinkCoupon);
    if (!freebieCoupon && !giftCoupon && !magicLinkCoupon)
      return { ...res, cartToBeUpdate: getCartWithoutFreeProduct(cart) };

    if (magicLinkCoupon) {
      if (magicLinkCoupon.fields.free_product) {
        const { updatedCart, itemsToBeAdd } = getUpdatedCart(
          [magicLinkCoupon.fields.free_product],
          cart
        );
        res.cartToBeUpdate = updatedCart;
        res.itemsToBeAdd = itemsToBeAdd;
      }
    } else {
      if (freebieCoupon) {
        const { updatedCart, itemsToBeAdd } = getUpdatedCart(
          [freebieCoupon.fields.free_product],
          cart
        );

        res.cartToBeUpdate = updatedCart;
        res.itemsToBeAdd = itemsToBeAdd;
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

  const adjustCart = (cart: any) => {
    const { cartToBeUpdate, itemsToBeAdd, giftProducts } = adjustFreebiesInCart(cart);

    dispatch(setGiftFreeProducts(giftProducts));
    const updatedCart = cartToBeUpdate.lines?.map((item: any) => ({
      id: item.id,
      merchandipseId: item.merchandise.id,
      quantity: item.quantity
    }));

    const _cart = {
      ...cartState,
      lines: cartToBeUpdate.lines.filter((line: any) => line.quantity > 0)
    };
    dispatch(cartActions.setCart(_cart));
    dispatch(setUpdateCartLoading(true));

    debouncedUpdateItemQuantity(updatedCart, itemsToBeAdd);
  };

  const debouncedUpdateItemQuantity = useMemo(
    () =>
      debounce((updatedCart, itemsToBeAdd) => {
        dispatch(cartActions.updateCart(updatedCart));
        if (itemsToBeAdd.length)
          itemsToBeAdd.forEach((item: any) => {
            dispatch(
              cartActions.addToCart({
                selectedVariantId: item.variantId,
                product: item.product,
                tempId: uuidv4()
              })
            );
          });
      }, 1000),
    [dispatch]
  );
  return {
    adjustFreebiesInCart,
    adjustCart
  };
}

export default useCoupon;
