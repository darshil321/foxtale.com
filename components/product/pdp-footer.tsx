'use client';
import React, { Suspense } from 'react';
import ProductDetailsItem from './product-details-item';
import { AddToCartButton } from 'components/cart/add-to-cart-button';
import { GokwikButton } from './go-kwik-button';
import { CartProvider } from '@shopify/hydrogen-react';
import { ProductVariant } from '@shopify/hydrogen-react/storefront-api-types';
import { useSearchParams } from 'next/navigation';

const ProductDescFooter = ({ product }: { product: any }) => {
  const searchParams = useSearchParams();
  const variants = product?.variants;
  const defaultVariantId = variants[0]?.id;
  const variant = variants?.find((variant: ProductVariant) =>
    variant.selectedOptions?.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );

  const selectedVariantID = variant?.id || defaultVariantId;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-screen">
      <div className="flex w-full justify-center border-t bg-white px-4 py-4 md:justify-between  md:px-[140px] md:py-5">
        <div className="hidden md:block">
          <Suspense fallback={null}>
            <ProductDetailsItem product={product} />
          </Suspense>
        </div>

        <div className="flex flex-row items-center gap-5">
          <Suspense fallback={null}>
            <AddToCartButton
              product={product}
              variants={product?.variants}
              availableForSale={product.availableForSale}
              buttonClasses={
                ' flex text-sm hover:text-purple-400 leading-7 leading-[22px] items-center justify-center text-base bg-white border border-black text-black py-2 px-6 md:py-2  md:px-10 uppercase tracking-wide font-medium'
              }
            />
          </Suspense>
          <Suspense fallback={null}>
            <CartProvider>
              <GokwikButton
                title={'BUY NOW'}
                buyNowButton={true}
                variantId={selectedVariantID}
                quantity={1}
              />
            </CartProvider>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProductDescFooter;
