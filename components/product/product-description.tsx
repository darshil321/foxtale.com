import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';

import Price from 'components/price';
import ProductsRatings from 'components/product/products-rating';
import VariantSelector from 'components/product/variant-selector';

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

  const filteredDataByKey = product?.metafields?.find(
    (item: any) => item?.key === 'product-sub-title'
  );
  const decodedHtml = filteredDataByKey?.value || '';

  return (
    <>
      <div className=" flex flex-col gap-1 pb-1 md:pb-3 ">
        <div className=" hidden flex-col gap-1 md:flex ">
          <div className="flex flex-col items-center gap-0 md:flex-row md:gap-3">
            <h1 className="mb-2 text-2xl font-medium leading-6">
              {product.title}
              {product?.variants[0]?.weight === 0 ? null : (
                <span className=" pl-2 text-center text-xs text-[#bcbec0]">
                  Size - {product?.variants[0]?.weight} ml
                </span>
              )}
            </h1>
          </div>
          <div className="text-[#6d6e71]" dangerouslySetInnerHTML={{ __html: decodedHtml }} />
          <ProductsRatings product={product} />
        </div>
        <div
          className="mr-auto flex items-center text-2xl
         font-semibold text-black"
        >
          <Price
            amount={parseInt(
              selectedVariantPrice ?? product.priceRange.maxVariantPrice.amount
            ).toString()}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            comparePrice={parseInt(product?.variants[0]?.compareAtPrice?.amount || '').toString()}
          />
          <span className="ml-1 text-sm font-medium text-[#bcbec0]">(inclusive of taxes)</span>
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
