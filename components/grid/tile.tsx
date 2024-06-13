/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { calculateSavedPrice, getProductId } from '@/lib/helper/helper';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { trackEvent } from 'utils/mixpanel';
import SavePriceTag from '../elements/save-price-tag';
// import { sendGAEvent } from '@next/third-parties/google';
import { getSource } from '@/lib/helper/helper';
import ProductTag from '../elements/product-tag';
import { useRouter } from 'next/navigation';

export function GridTileImage({
  isInteractive = true,
  product,
  images,
  active,
  label = {
    title: '',
    amount: '',
    description: '',
    currencyCode: '',
    position: 'bottom'
  },
  index = 0,
  alt = 'image',
  isCollection,
  collectionIndex = -1,
  ...props
}: {
  collectionIndex?: number;
  isInteractive?: boolean;
  active?: boolean;
  images?: any;
  product?: any;
  isCollection?: boolean;
  alt?: string;

  index?: number;
  label?: {
    title: string;
    amount: string;
    description?: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  const productCollections = useSelector((state: any) => state.collections.collectionsProducts);
  const router = useRouter();
  const [ratings, setRatings] = useState<any>(null);

  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    if (!product || product?.ratings) return;
    const _prod = productCollections?.find((p: any) => p.id === product.id);

    if (_prod && _prod?.ratings) setRatings(_prod.ratings);
  }, [product, productCollections]);

  if (!product) return null;

  const productDescription = product?.metafields?.find((item: any) => item?.key === 'hp_excerpt');
  const productTopBar = product?.metafields?.find((item: any) => item?.key === 'pr_excerpt');

  const setPriority = collectionIndex === 0 && (index === 0 || index === 1);
  const primaryImage = props?.src;
  const secondaryImage = images && images[1]?.url;

  return (
    <div
      className={clsx(
        'flex h-full w-full items-center justify-between overflow-hidden border bg-white',
        {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200': !active,
          'rounded-lg': !isCollection,
          ' rounded-b-lg': isCollection
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {primaryImage ? (
        <div className="flex h-full min-h-[350px] w-full flex-col justify-between md:min-h-[456px]">
          <div className="flex h-full w-full flex-col">
            <div className=" h-fit">
              <div className=" h-fit w-full overflow-hidden object-cover">
                <div
                  onClick={() => {
                    router.push(
                      `/product/${product?.handle}?option=${product.options[0].values[0]}`,
                      undefined
                    );
                  }}
                >
                  Test 3
                </div>

                <Link
                  href={`/product/[handle]`}
                  as={`/product/${product?.handle}?option=${product.options[0].values[0]}`}
                  className="relative"
                  prefetch
                  shallow
                >
                  test1
                </Link>
                <Link
                  href={`/product/[handle]`}
                  as={`/product/${product?.handle}?option=${product.options[0].values[0]}`}
                  className="relative"
                  prefetch
                >
                  <Image
                    onClick={() => {
                      trackEvent('Viewed Product', {
                        'Viewed Product Name': product.handle,
                        'Viewed Product Tags': product?.tags?.join(','),
                        'Viewed Product SKU': '',
                        'Viewed Product Type': product.productType,
                        'Viewed Product Variant': getProductId(product.id),
                        'Viewed Product Vendor': product.vendor,
                        'Viewed Product Price': product?.priceRange?.maxVariantPrice?.amount,
                        productTitle: product.title,
                        productUrl: window.location.href,
                        productCurrency: product?.priceRange?.maxVariantPrice?.currencyCode,
                        category: '',
                        from: 'from-feature-collection-image',
                        source: getSource(window.location.href),
                        'api-url-for-data': window.location.href
                      });
                    }}
                    className={clsx(
                      'relative aspect-square h-full max-h-[200px] min-h-[200px] w-full object-cover transition-opacity duration-500 ease-in-out md:max-h-max  md:min-h-[300px]',
                      {
                        'transition duration-1000 ease-in-out group-hover:scale-125': isInteractive
                      }
                    )}
                    src={isHovered && secondaryImage ? secondaryImage : primaryImage}
                    width={300}
                    height={300}
                    alt={alt}
                    quality={100}
                    loading={setPriority ? 'eager' : 'lazy'}
                    sizes="(max-width: 640px) 200px, 300px"
                    priority={setPriority ? setPriority : false}
                    style={{ transition: 'opacity 0.5s ease-in-out' }}
                  />
                  {product?.variants[0]?.compareAtPrice && (
                    <SavePriceTag
                      savePrice={calculateSavedPrice(
                        product?.variants[0]?.compareAtPrice.amount,
                        label?.amount
                      )}
                    />
                  )}
                  {isCollection && productTopBar.value && (
                    <div className="absolute left-0 top-0 w-full bg-black px-2 py-1 text-center text-xs font-medium uppercase tracking-widest text-white">
                      {productTopBar.value}
                    </div>
                  )}
                  {ratings && ratings?.average !== 0 && (
                    <div className="absolute bottom-2 left-2 flex w-max flex-row items-center justify-between gap-1 rounded-sm bg-white px-[5px] py-[1px] text-black md:py-[1.5px] ">
                      <div data-rating="4.8">
                        <div className=" text-[11px] md:text-[14px]" style={{ width: '11px' }}>
                          ★
                        </div>
                        <div />
                      </div>
                      <span
                        data-value={product?.ratings?.average}
                        style={{
                          transformOrigin: '0px 0px',
                          opacity: 1,
                          transform: 'scale(1, 1)'
                        }}
                        className="text-xs font-normal md:ml-[3px] md:text-[14px]"
                      >
                        {ratings.average}
                      </span>
                      <span style={{ display: 'none' }}>52</span>
                    </div>
                  )}

                  <ProductTag show={isCollection ? false : true} product={product} />
                </Link>
              </div>
            </div>
            <div className="flex h-full flex-1 flex-grow flex-col justify-between space-y-[4px] px-3 py-1 md:py-[9px]">
              <div>
                <Link
                  onClick={() => {
                    trackEvent('Viewed Product', {
                      'Viewed Product Name': product.handle,
                      'Viewed Product Tags': product?.tags?.join(','),
                      'Viewed Product SKU': '',
                      'Viewed Product Type': product.productType,
                      'Viewed Product Variant': getProductId(product.id),
                      'Viewed Product Vendor': product.vendor,
                      'Viewed Product Price': product?.priceRange?.maxVariantPrice?.amount,
                      productTitle: product.title,
                      productUrl: window.location.href,
                      productCurrency: product?.priceRange?.maxVariantPrice?.currencyCode,
                      category: '',
                      from: 'from-feature-collection-image',
                      source: getSource(window.location.href),
                      'api-url-for-data': window.location.href
                    });
                  }}
                  href={`/product/${product?.handle}?option=${product.options[0].values[0]}`}
                >
                  <p className="leading-2 line-clamp-2 cursor-pointer text-[14px] font-medium transition-all hover:text-purple-400 md:text-base md:leading-6">
                    {label?.title}
                  </p>
                </Link>
                <p className="line-clamp-1  text-[10px] leading-7 text-[#6e6e6e] md:text-xs">
                  {productDescription?.value}
                </p>
              </div>
              <div className="t4s-product-price text-base font-medium">
                <span className="font-poppins text-base font-semibold" /> ₹{' '}
                {parseInt(label?.amount)}
                {product?.variants[0]?.compareAtPrice && (
                  <span className="ml-2 text-[#6e6e6e] line-through">
                    ₹ {parseInt(product?.variants[0]?.compareAtPrice.amount)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <Suspense fallback={null}>
              <AddToCartButton
                product={product}
                variants={product.variants}
                availableForSale={product?.availableForSale || false}
                buttonClasses={
                  'p-2 w-full relative flex flex-1 text-sm hover:text-purple-400 items-center justify-center text-base bg-black border border-black text-white md:py-3 md:px-8 uppercase tracking-wide font-normal md:font-semibold'
                }
              />
            </Suspense>
          </div>
        </div>
      ) : null}
    </div>
  );
}
