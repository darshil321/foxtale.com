'use client';
import { useEffect, useRef, useMemo } from 'react';

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

    if (productData.title && productData.priceRange) {
      trackedRef.current = true; // Set the ref to true to prevent future tracking

      if (window && window.dataLayer) {
        const parts = productData.id.split('/');
        const id = parts[parts.length - 1];

        window.dataLayer.push({
          event: 'view_item',
          ga: {
            currency: 'INR',
            value: product?.priceRange?.maxVariantPrice?.amount,
            items: [
              {
                item_id: id,
                item_name: product?.title,
                price: product?.priceRange?.maxVariantPrice?.amount,
                quantity: 1
              }
            ]
          },
          fb: {
            content_category: 'recommended',
            content_ids: [id],
            content_name: productData.title,
            content_type: 'product_group',
            currency: productData.priceRange.minVariantPrice.currencyCode,
            value: productData.priceRange.maxVariantPrice.amount
          }
        });
      }

      console.log('FB Event fired');
    } else {
      console.log('Product data incomplete.');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData]); // Dependency array with productData

  return <div></div>;
};

export default InitLoad;
