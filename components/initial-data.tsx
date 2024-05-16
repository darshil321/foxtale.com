'use client';

import { getMetaObjects, getProducts } from '@/lib/shopify';
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

const InitialData: React.FC<Props> = async () => {
  const products = useAppSelector((state) => state.products.products) || [];
  const dispatch = useAppDispatch();

  const promises = [
    getMetaObjects('gifts'),
    getMetaObjects('freebies'),
    getMetaObjects('magic_link')
  ];

  const getMetaData = async () => {
    const results = await Promise.allSettled(promises);
    const giftsCoupon = results[0]?.status === 'fulfilled' ? results[0].value : null;
    const freebieCoupons = results[1]?.status === 'fulfilled' ? results[1].value : null;
    const magicLinks = results[2]?.status === 'fulfilled' ? results[2].value : null;

    if (freebieCoupons) dispatch(setFreebieCoupons(freebieCoupons));
    if (giftsCoupon) dispatch(setGiftCoupons(giftsCoupon));
    if (magicLinks) dispatch(setMagicLinkCoupons(magicLinks));
  };

  const getProductsData = async () => {
    const res = await getProducts({});
    if (res) dispatch(setProducts(res));
  };

  useEffect(() => {
    getMetaData();
    if (!products || !products.length) getProductsData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default InitialData;
