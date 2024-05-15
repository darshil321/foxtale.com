import type { Metadata } from 'next';
import { getProduct, getProductRecommendations, getProducts } from 'lib/shopify';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GridTileImage } from '@/components/grid/tile';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import dynamic from 'next/dynamic';

const ProductSlider = dynamic(() => import('@/components/product/product-slider'));
const OfferSection = dynamic(() => import('@/components/product/offers-section'));
const ProductsRatings = dynamic(() => import('@/components/product/products-rating'));
const ProductDescription = dynamic(() => import('@/components/product/product-description'));
const ProductCarouselSlider = dynamic(() => import('@/components/product/product-carousel'));
const ProductDetailsTabs = dynamic(() => import('@/components/product/product-details-tabs'));
const ProductDisclosure = dynamic(() => import('@/components/product/product-disclosure'));
const ProductDescFooter = dynamic(() => import('@/components/product/pdp-footer'));
const Accordion = dynamic(() => import('@/components/layout/accordion'));
const ResultsSection = dynamic(() => import('@/components/product/results-section'));

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
      <div className="mx-auto max-w-screen-2xl pt-4  md:pt-8">
        <div className="flex flex-col rounded-lg  lg:flex-row lg:gap-8 ">
          <div className="flex flex-col px-4 pb-2 md:hidden">
            <div className="mb-2 flex items-end gap-2 md:gap-3">
              <h1 className=" text-2xl font-medium leading-7">
                {product.title}{' '}
                <span className="text-center text-xs text-[#bcbec0]">
                  Size - {product?.variants[0]?.weight} ml
                </span>
              </h1>
            </div>
            <div className="text-[#6d6e71]" dangerouslySetInnerHTML={{ __html: decodedHtml }} />
            <ProductsRatings product={product} />
          </div>
          <div className="h-full w-full basis-full lg:basis-3/6">
            <Suspense
              fallback={
                <div className="relative aspect-square  h-full max-h-[550px] w-full overflow-hidden">
                  ...Loading Products
                </div>
              }
            >
              <ProductSlider images={product.images} />
            </Suspense>
          </div>
          <div className="basis-full  lg:basis-3/6">
            <div className="px-4 pt-3 md:px-2 md:pt-0">
              <ProductDescription product={product} searchParams={searchParams} />
            </div>
            <OfferSection />
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
        >
          <ProductCarouselSlider />
        </Suspense>
        <ProductDetailsTabs product={product} />
        <Accordion product={product} />
        <Suspense fallback={null}>
          <RelatedProducts id={product.id} />
        </Suspense>
        <ProductDescFooter product={product} />
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
            className=" w-1/2 flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link
              className="relative h-full w-full"
              href={`/product/${product.handle}/${product.options[0]?.name}`}
            >
              <GridTileImage
                product={product}
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage?.url}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
