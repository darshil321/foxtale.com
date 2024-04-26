import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import { VariantSelector } from './variant-selector';
import ProductsRatings from 'components/product/products-rating';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-4 flex flex-col pb-3 ">
        <div className="flex flex-row items-center  gap-3">
          <h1 className="mb-2 text-2xl font-medium leading-6">{product.title.slice(0, 28)}</h1>
          <span className="text-center text-xs text-neutral-400"> Size -30 ml</span>
        </div>

        <h5>Treats hyperpigmentation and dark spots</h5>
        <ProductsRatings />

        <div className="mr-auto text-2xl font-semibold text-black">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            text={'Inclusive of all tax'}
          />
        </div>
      </div>
      <Suspense fallback={null}>
        <VariantSelector options={product.options} variants={product.variants} />
      </Suspense>

      {product.descriptionHtml ? (
        <Prose className="mb-6 text-sm leading-tight " html={product.descriptionHtml} />
      ) : null}
    </>
  );
}
