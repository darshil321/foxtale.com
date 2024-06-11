'use client';
import { scrollToElementById } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ProductsRatings = ({ product }: { product?: any }) => {
  const productCollections = useSelector((state: any) => state.collections.collectionsProducts);
  const [ratings, setRatings] = useState<any>(null);

  useEffect(() => {
    if (!product || product?.ratings) return;
    const _prod = productCollections?.find((p: any) => p.id === product.id);

    if (_prod && _prod?.ratings) setRatings(_prod.ratings);
  }, [product, productCollections]);

  if (!product) return null;

  return (
    <>
      {ratings?.average !== 0 && (
        <div className="flex flex-row items-center gap-2 py-2">
          <div className="flex flex-row items-center gap-2">
            <div
              className="fera-stars fera-productReviewsSummary-stars fera-productReviewsSummary-reviews-verification-popover fera-verified"
              data-fera-verified="true"
              data-rating="4.8"
              aria-expanded="false"
            >
              <div className="" style={{ width: '96.0%' }}>
                ★
              </div>
              <div className="fera-stars-bg fera-productReviewsSummary-stars-bg" />
            </div>
            <span
              className="text-[10px] font-medium text-neutral-400  md:text-sm "
              data-value="4.8"
              style={{ transformOrigin: '0px 0px', opacity: 1, transform: 'scale(1, 1)' }}
            >
              {ratings?.average}
            </span>
            <span className="sr-only bg-slate-600" data-value={194}>
              194
            </span>
            <span style={{ display: 'none' }}>194</span>
          </div>
          <span
            onClick={() => scrollToElementById('Reviews')}
            className="cursor-pointer text-[10px] font-medium text-neutral-400 "
          >
            (Tap to see all reviews)
          </span>
        </div>
      )}
    </>
  );
};

export default ProductsRatings;
