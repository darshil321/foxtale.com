'use client';
import useCoupon from '@/lib/hooks/use-coupon';
import { getProducts } from '@/lib/shopify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFreebieCoupons, setGiftCoupons, setMagicLinkCoupons } from '@/store/slices/cart-slice';
import { setProducts } from '@/store/slices/product-slice';
// import { setProducts } from '@/store/slices/product-slice';
import React, { useEffect } from 'react';

interface Props {
  giftsCoupon?: any;
  freebieCoupons?: any;
  magicLinks?: any;
  collections?: any;
}

const InitialData: React.FC<Props> = ({ giftsCoupon, freebieCoupons, magicLinks }) => {
  const products = useAppSelector((state) => state.products.products) || [];
  const cart = useAppSelector((state) => state.cart.cart);
  const dispatch = useAppDispatch();
  const { adjustCart } = useCoupon();

  const getProductsData = async () => {
    const res = await getProducts({});
    if (res) dispatch(setProducts(res));
  };

  useEffect(() => {
    if (freebieCoupons) dispatch(setFreebieCoupons(freebieCoupons));
    if (giftsCoupon) dispatch(setGiftCoupons(giftsCoupon));
    if (magicLinks) dispatch(setMagicLinkCoupons(magicLinks));

    if (!products || !products.length) getProductsData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cart && cart.lines) {
      adjustCart(cart);
    }
  }, [cart, adjustCart]);

  return <></>;
};

export default InitialData;
