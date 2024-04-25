import React from 'react';

const ProductsRatings = () => {
  return (
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
          className=" fera-productReviewsSummary-avgRating"
          data-value="4.8"
          style={{ transformOrigin: '0px 0px', opacity: 1, transform: 'scale(1, 1)' }}
        >
          4.8
        </span>
        <span className="sr-only" data-value={194}>
          194
        </span>
        <span style={{ display: 'none' }}>194</span>
      </div>

      <span className="text-[10px] font-medium  text-neutral-400 ">(Tap to see all reviews)</span>
    </div>
  );
};

export default ProductsRatings;
