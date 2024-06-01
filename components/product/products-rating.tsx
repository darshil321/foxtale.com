'use client';
import { scrollToElementById } from '@/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { fbEvent } from 'utils/facebook-pixel';

const ProductsRatings = ({ product }: { product?: any }) => {
  const [tracked, setTracked] = useState(false);
  const productData = useMemo(
    () => ({
      ...product
    }),
    [product]
  );
  useEffect(() => {
    if (!productData) return;

    if (typeof window !== 'undefined' && typeof window.fbq === 'function' && !tracked) {
      console.log('useEffectProd', product);
      const parts = productData.id.split('/');
      const id = parts[parts.length - 1];
      if (productData && productData.title && productData.priceRange) {
        setTracked(true);
        fbEvent('ViewContent', {
          content_category: 'recommended',
          content_ids: [id],
          content_name: productData.title,
          content_type: 'product_group',
          currency: productData?.priceRange?.minVariantPrice?.currencyCode,
          value: productData?.priceRange?.maxVariantPrice?.amount
        });
        console.log('FB Event fired');
      } else {
        console.log('Product data incomplete.');
      }
    }
  }, [product, productData, tracked]);

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
