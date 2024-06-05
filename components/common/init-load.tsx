'use client';
import { getSource } from '@/lib/helper/helper';
import { useEffect, useRef, useMemo } from 'react';
import { trackEvent } from 'utils/mixpanel';

const InitLoad = ({ product, isCollectionPage }: { product?: any; isCollectionPage?: boolean }) => {
  const trackedRef = useRef(false);
  const productData = useMemo(
    () => ({
      ...product
    }),
    [product]
  );

  useEffect(() => {
    if (isCollectionPage && !trackedRef.current) {
      trackedRef.current = true;
      trackEvent('Viewed Collection', {
        page_type: 'collection',
        source: getSource(window.location.href),
        page_url: window.location.href,
        page_name: window.location.href.split('/').pop()
      });
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        trackEvent('Viewed Product', {
          page_type: 'product',
          source: getSource(window.location.href),
          page_url: window.location.href,
          page_name: window.location.href.split('/').pop()
        });

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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData]); // Dependency array with productData

  return <div></div>;
};

export default InitLoad;
