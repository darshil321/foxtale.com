'use client';
import { useEffect, useMemo } from 'react';
import CartModal from './modal';
import { useAppSelector } from '@/store/hooks';
import useCoupon from '@/lib/hooks/use-coupon';
import { createCartItem, getCartData, getDefaultVariant, getTempId } from '@/lib/helper/helper';
import { useDispatch } from 'react-redux';
import { cartActions } from '@/store/actions/cart.action';
import { clearLoadingIds, setGiftFreeProducts } from '@/store/slices/cart-slice';

export default function Cart() {
  const cart = useAppSelector((state) => state.cart.cart);
  const { adjustCart } = useCoupon();
  const dispatch = useDispatch();

  const { totalQuantity } = useMemo(() => {
    return getCartData(cart);
  }, [cart]);

  useEffect(() => {
    if (cart && cart.lines) {
      const { freebiesToBeAdd, freebiesToBeRemove, giftProducts } = adjustCart(cart);

      const updatedCart = {
        ...cart,
        lines: [
          ...cart.lines.filter((item: any) => !freebiesToBeRemove?.includes(item.merchandise.id)),
          ...freebiesToBeAdd.map((item: any) =>
            createCartItem(
              getTempId(),
              item.product,
              getDefaultVariant(item.product, item.variantId)
            )
          )
        ]
      };

      dispatch(cartActions.setCart(updatedCart));

      dispatch(setGiftFreeProducts(giftProducts));
      dispatch(cartActions.manageCart({ updatedCart }));
    }

    return () => {
      dispatch(clearLoadingIds());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalQuantity]);

  return <CartModal />;
}
