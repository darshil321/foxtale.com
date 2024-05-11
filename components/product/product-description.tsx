import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import { VariantSelector } from './variant-selector';
import ProductsRatings from 'components/product/products-rating';

export default function ProductDescription({
  product,
  searchParams
}: {
  product: Product;
  searchParams: any;
}) {
  const selectedVariantPrice = product.variants.find(
    (variant) => variant.title === searchParams?.option
  )?.price.amount;

  return (
    <>
      <div className=" flex flex-col gap-1 pb-1 md:pb-3 ">
        <div className=" hidden flex-col gap-1 md:flex ">
          <div className="flex flex-col items-center gap-0 md:flex-row md:gap-3">
            <h1 className="mb-2 text-2xl font-medium leading-6">{product.title}</h1>
            <span className="text-center text-xs text-neutral-400"> Size -30 ml</span>
          </div>
          <h5>Treats hyperpigmentation and dark spots</h5>
          <ProductsRatings product={product} />
        </div>
        <div className="mr-auto text-2xl font-semibold text-black">
          <Price
            amount={selectedVariantPrice ?? product.priceRange.maxVariantPrice.amount}
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
