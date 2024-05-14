'use client';
import { useAppDispatch } from '@/store/hooks';
import { setFreebieCoupons, setGiftCoupons, setMagicLinkCoupons } from '@/store/slices/cart-slice';
// import { setProducts } from '@/store/slices/product-slice';
import React, { useEffect } from 'react';

interface Props {
  giftsCoupon?: any;
  freebieCoupons?: any;
  magicLinks?: any;
  collections?: any;
  products?: any;
}

const InitialData: React.FC<Props> = ({ giftsCoupon, freebieCoupons, magicLinks }) => {
  console.log('giftsCoupon', giftsCoupon);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (freebieCoupons) dispatch(setFreebieCoupons(freebieCoupons));

    if (giftsCoupon) dispatch(setGiftCoupons(giftsCoupon));

    if (magicLinks) dispatch(setMagicLinkCoupons(magicLinks));

    // if (products) dispatch(setProducts(products));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default InitialData;
