'use client';
import { useEffect, useRef, useMemo } from 'react';
import { fbEvent } from 'utils/facebook-pixel';

const InitLoad = ({ product }: { product: any }) => {
  const trackedRef = useRef(false);
  const productData = useMemo(
    () => ({
      ...product
    }),
    [product]
  );

  useEffect(() => {
    if (
      !productData ||
      typeof window === 'undefined' ||
      typeof window.fbq !== 'function' ||
      trackedRef.current // Check if already tracked using ref
    ) {
      return;
    }

    const parts = productData.id.split('/');
    const id = parts[parts.length - 1];
    if (productData.title && productData.priceRange) {
      trackedRef.current = true; // Set the ref to true to prevent future tracking
      fbEvent('ViewContent', {
        content_category: 'recommended',
        content_ids: [id],
        content_name: productData.title,
        content_type: 'product_group',
        currency: productData.priceRange.minVariantPrice.currencyCode,
        value: productData.priceRange.maxVariantPrice.amount
      });

      console.log('FB Event fired');
    } else {
      console.log('Product data incomplete.');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array

  return <div></div>;
};

export default InitLoad;
