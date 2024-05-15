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
import { v4 as uuidv4 } from 'uuid';
import { debounce } from '../helper/helper';

function useCoupon() {
  const freebies = useAppSelector((state) => state.cart.freebieCoupons) || [];
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
          const giftProducts = fields.free_products.map((product: any) =>
            findVariant(products, product)
          );

          res.giftProducts = giftProducts.filter(Boolean);
        }
      }
    }
    return res;
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

        // if (carts?.id) dispatch(cartActions.attemptGetCarts({ cartId: carts.id }));
      }, 1000),
    [dispatch]
  );

  const adjustCart = (cart: any) => {
    const { cartToBeUpdate, itemsToBeAdd, giftProducts } = adjustFreebiesInCart(cart);

    const updatedCart = cartToBeUpdate.lines?.map((item: any) => ({
      id: item.id,
      merchandiseId: item.merchandise.id,
      quantity: item.quantity
    }));

    console.log('updatedCart', updatedCart);
    const _cart = {
      ...cart,
      lines: cartToBeUpdate.lines.filter((line: any) => line.quantity > 0)
    };

    dispatch(cartActions.setCart(_cart));
    dispatch(setUpdateCartLoading(true));
    dispatch(setGiftFreeProducts(giftProducts));

    debouncedUpdateItemQuantity(updatedCart, itemsToBeAdd);
  };

  return {
    adjustFreebiesInCart,
    adjustCart
  };
}

export default useCoupon;
