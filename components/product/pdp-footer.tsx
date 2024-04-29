import React, { Suspense } from 'react';
import ProductDetailsItem from './product-details-item';
// import { BuyNowButton } from 'components/cart/buy-now-button';
import { AddToCartButton } from 'components/cart/add-to-cart-button';
import { GokwikButton } from 'components/elements/gokwik-button';

const ProductDescFooter = ({ product }: { product: any }) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-screen ">
      <div className="flex w-full justify-center border-t bg-white px-4 py-3 md:justify-between  md:px-[140px] md:py-4">
        <div className="hidden md:block">
          <Suspense fallback={null}>
            <ProductDetailsItem />
          </Suspense>
        </div>

        <div className="flex flex-row  items-center gap-5">
          <Suspense fallback={null}>
            <AddToCartButton
              variants={product.variants}
              availableForSale={product.availableForSale}
            />
          </Suspense>
          <Suspense fallback={null}>
            <GokwikButton buyNowButton={true} variantId={product?.variants[0]?.id} quantity={1} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProductDescFooter;
