'use client';
import { appendReviewAndRating } from '@/lib/shopify';
import { setCollectionProduct } from '@/store/slices/collections-slice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function InitialReviews({ products }: any) {
  const dispatch = useDispatch();
  const appendData = async (products: any) => {
    const res = await appendReviewAndRating(products.flat(Infinity));

    return res;
  };
  useEffect(() => {
    if (products && products.length > 0) {
      appendData(products).then((res) => {
        dispatch(setCollectionProduct(res));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}

export default InitialReviews;
