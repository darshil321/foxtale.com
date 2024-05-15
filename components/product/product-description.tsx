import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Price = dynamic(() => import('components/price'));
const ProductsRatings = dynamic(() => import('components/product/products-rating'));
const VariantSelector = dynamic(() => import('components/product/variant-selector'));

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
              <span className="pl-2 text-center text-xs text-neutral-400">
                Size - {product?.variants[0]?.weight} ml
              </span>
            </h1>
          </div>
          <div className="text-[#6d6e71]" dangerouslySetInnerHTML={{ __html: decodedHtml }} />
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
