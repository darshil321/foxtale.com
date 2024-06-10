import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getCollectionProducts, getProduct } from 'lib/shopify';
import ProductSlider from '@/components/product/product-slider';
import ProductDisclosure from '@/components/product/product-disclosure';
import ProductsRatings from '@/components/product/products-rating';
import ProductDescription from '@/components/product/product-description';
import ProductDetailsTabs from '@/components/product/product-details-tabs';
import ProductDescFooter from '@/components/product/pdp-footer';
import Accordion from '@/components/layout/accordion';
import ResultsSection from '@/components/product/results-section';
import ReviewComponent from '@/components/elements/ratings-reviews';
import LimitedStockBanner from '@/components/elements/limited-stock-banner';
import ReviewForm from '@/components/review-component/review-form';
import UserForm from '@/components/review-component/user-form';
import SuccessModal from '@/components/review-component/success-modal';
import InitLoad from '@/components/common/init-load';
import InitialReviews from '@/components/initial-reviews';

export const generateStaticParams = async () => {
  const collections = [
    {
      handle: '399-store'
    },
    {
      handle: '499-store'
    }
  ];
  const promises = collections.map(
    async (collection) => await getCollectionProducts({ collection: collection.handle })
  );

  const [products399 = [], products499 = []] = await Promise.all(promises);

  return [...products399, ...products499].map((product: any) => ({
    handle: product?.handle
  }));
};

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ],
          title: product.seo.title || product.title,
          description: product.seo.description || product.description
        }
      : null
  };
}

export default async function ProductPage({
  params,
  searchParams
}: {
  params: { handle: string };
  searchParams: any;
}) {
  const product = await getProduct(params.handle);
  // const product = await appendReviewAndRatingInProduct(productWithoutRating);
  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.title,
    description: product?.description,
    image: product?.featuredImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product?.priceRange.minVariantPrice.currencyCode,
      highPrice: product?.priceRange.maxVariantPrice.amount,
      lowPrice: product?.priceRange.minVariantPrice.amount
    }
  };
  const filteredDataByKey = product?.metafields?.find(
    (item: any) => item?.key === 'product-sub-title'
  );

  const decodedHtml = filteredDataByKey?.value || '';

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <InitialReviews product={product} />
      <div className="max-w-screen-3xl mx-auto animate-fadeIn pt-4 transition-opacity  md:pt-8">
        <div className="flex flex-col rounded-lg  lg:flex-row lg:gap-8 ">
          <div className="flex flex-col px-4 pb-2 md:hidden">
            <div className="mb-2 flex items-end gap-2 md:gap-3">
              <h1 className=" text-2xl font-medium leading-7">
                {product.title}{' '}
                {product?.variants[0]?.weight === 0 ? null : (
                  <span className="text-center text-xs text-[#bcbec0]">
                    Size - {product?.variants[0]?.weight} ml
                  </span>
                )}
              </h1>
            </div>
            <div className="text-[#6d6e71]" dangerouslySetInnerHTML={{ __html: decodedHtml }} />
            <ProductsRatings product={product} />
          </div>
          <div className="h-full w-full basis-full lg:basis-3/6">
            <ProductSlider images={product.images} />
          </div>

          <ReviewForm product={product} />

          <UserForm />
          <SuccessModal />

          <div className="basis-full  lg:basis-3/6">
            <div className="px-4 pt-3 md:px-2 md:pt-0">
              <ProductDescription product={product} searchParams={searchParams} />
            </div>
            <LimitedStockBanner />
          </div>
        </div>
        <div>{<ProductDisclosure product={product} />}</div>
        <ResultsSection product={product} />
        <Suspense
          fallback={
            <div className="relative aspect-square  h-full max-h-[550px] w-full overflow-hidden">
              ...Loading Products
            </div>
          }
        ></Suspense>
        <ProductDetailsTabs product={product} />
        <Suspense fallback={<>...loading reviews</>}>
          <ReviewComponent product={product} />
        </Suspense>
        <InitLoad product={product} />
        <Accordion product={product} />
        <ProductDescFooter product={product} />
      </div>
    </div>
  );
}
