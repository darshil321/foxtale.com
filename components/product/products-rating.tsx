import Link from 'next/link';
import React from 'react';

const ProductsRatings = ({ product }: { product?: any }) => {
  return (
    <>
      {product?.ratings?.average && (
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
              {product?.ratings?.average}
            </span>
            <span className="sr-only bg-slate-600" data-value={194}>
              194
            </span>
            <span style={{ display: 'none' }}>194</span>
          </div>
          <Link href={'#Reviews'} className="text-[10px] font-medium  text-neutral-400 ">
            (Tap to see all reviews)
          </Link>
        </div>
      )}
    </>
  );
};

export default ProductsRatings;
