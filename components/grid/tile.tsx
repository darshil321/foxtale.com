'use client';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { trackEvent } from 'utils/mixpanel';
import ProductTag from '../elements/product-tag';
import SavePriceTag from '../elements/save-price-tag';
import { calculateSavedPrice } from '@/lib/helper/helper';
import { sendGAEvent } from '@next/third-parties/google';

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
  collectionIndex = -1,
  ...props
}: {
  collectionIndex?: number;
  isInteractive?: boolean;
  active?: boolean;
  images?: any;
  product?: any;
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
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const productDescription = product?.metafields?.find((item: any) => item?.key === 'hp_excerpt');
  const setPriority = collectionIndex === 0 && (index === 0 || index === 1);
  const primaryImage = props?.src;
  const secondaryImage = images && images[1]?.url;

  return (
    <div
      className={clsx(
        'flex w-full items-center justify-center overflow-hidden rounded-lg border bg-white',
        {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200': !active
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {primaryImage ? (
        <div className="flex h-full min-h-[320px] w-full flex-col justify-between md:max-h-[100%] md:min-h-[456px]">
          <div
            onClick={() => {
              sendGAEvent('event', 'view_item', {
                currency: 'INR',
                value: product?.priceRange?.maxVariantPrice?.amount,
                items: [
                  {
                    item_id: product?.id,
                    item_name: product?.title,
                    price: product?.priceRange?.maxVariantPrice?.amount,
                    quantity: 1
                  }
                ]
              });

              trackEvent('Product Clicked', {
                Product_Name: product.title,
                Product_Url: '',
                Product_Price: product?.priceRange?.maxVariantPrice?.amount,
                Price_Currency: product?.priceRange?.maxVariantPrice?.currencyCode,
                Source: '',
                Category: '',
                Tags: product.tags,
                Variant_SKU: ''
              });
            }}
            className="flex h-full w-full flex-col"
          >
            <div className="relative">
              <div className="h-full w-full overflow-hidden object-cover">
                <Link href={`/product/${product?.handle}?option=${product.options[0].values[0]}`}>
                  <Image
                    className={clsx(
                      'relative aspect-square h-full min-h-[200px] w-full object-cover transition-opacity duration-500 ease-in-out  md:min-h-[300px]',
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
                  <ProductTag product={product} />
                </Link>
              </div>
              {product.ratings && product.ratings.average !== 0 && (
                <div className="absolute bottom-2 left-2 flex w-max flex-row justify-between gap-1 rounded-sm bg-white px-[5px] py-[1px] text-black">
                  <div data-rating="4.8">
                    <div
                      className="fera-stars-rating fera-productReviewsSummary-stars-rating"
                      style={{ width: '96.0%' }}
                    >
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
                  >
                    {product.ratings.average}
                  </span>
                  <span style={{ display: 'none' }}>52</span>
                </div>
              )}
            </div>
            <div className="space-y-[4px] px-3 py-[9px]">
              <div>
                <Link href={`/product/${product?.handle}?option=${product.options[0].values[0]}`}>
                  <p className="leading-2 line-clamp-1 cursor-pointer text-[12px] font-medium transition-all hover:text-purple-400 md:text-base md:leading-6">
                    {label?.title}
                  </p>
                </Link>
                <p className="line-clamp-1 pt-1 text-[10px] leading-7 text-[#6e6e6e] md:text-xs">
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
