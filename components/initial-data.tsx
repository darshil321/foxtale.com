'use client';
import { useAppDispatch } from '@/store/hooks';
import { setFreebieCoupons, setGiftCoupons } from '@/store/slices/cart-slice';
import React, { useEffect } from 'react';

interface Props {
  giftsCoupon: any;
  freebieCoupons: any;
}

const InitialData: React.FC<Props> = ({ giftsCoupon, freebieCoupons }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setFreebieCoupons(freebieCoupons));
    dispatch(setGiftCoupons(giftsCoupon));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div></div>;
};

export default InitialData;
