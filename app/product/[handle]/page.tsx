import type { Metadata } from 'next';
import { getProduct, getProductRecommendations, getProducts } from 'lib/shopify';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GridTileImage } from 'components/grid/tile';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import dynamic from 'next/dynamic';
const ProductDescription = dynamic(() => import('components/product/product-description'));
const ProductCarouselSlider = dynamic(() => import('components/product/product-carousel'));
const ProductDetailsTabs = dynamic(() => import('components/product/product-details-tabs'));
const ProductDisclosure = dynamic(() => import('components/product/product-disclosure'));
const ProductDescFooter = dynamic(() => import('components/product/pdp-footer'));
const Accordion = dynamic(() => import('components/layout/accordion'));
const ResultsSection = dynamic(() => import('components/product/results-section'));

import CustomInputBtn from 'components/elements/custom-input-with-btn';
import { ProductSlider } from 'components/product/product-slider';
import OfferSection from 'components/product/offers-section';

export const generateStaticParams = async () => {
  const products = await getProducts({});

  return products?.map((product: any) => ({
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
          ]
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
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl  pt-3  md:pt-8 ">
        <div className="flex flex-col rounded-lg  lg:flex-row lg:gap-8 ">
          <div className="h-full w-full basis-full lg:basis-3/6">
            <Suspense
              fallback={
                <div className="relative aspect-square  h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <ProductSlider images={product.images} />
            </Suspense>
          </div>
          <div className="basis-full  lg:basis-3/6">
            <div className="px-4 pt-3 md:px-2 md:pt-0">
              <Suspense fallback={null}>
                <ProductDescription product={product} searchParams={searchParams} />
              </Suspense>
            </div>
            <OfferSection />
            <div className="my-3 px-4 md:px-0">
              <Suspense fallback={null}>
                <CustomInputBtn
                  className="w-full py-1 text-xs "
                  text="Enter your pincode"
                  buttonText="Check"
                />
              </Suspense>
            </div>
          </div>
        </div>
        <div>{<ProductDisclosure />}</div>

        <ResultsSection />
        <ProductCarouselSlider />
        <ProductDetailsTabs />
        <Accordion />
        <ProductDescFooter product={product} />
        <RelatedProducts id={product.id} />
      </div>
    </div>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="px-4 py-8 md:px-0">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className=" w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link className="relative h-full w-full" href={`/product/${product.handle}`}>
              <GridTileImage
                product={product}
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage?.url}
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
