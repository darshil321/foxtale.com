'use client';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { trackEvent } from 'utils/mixpanel';
import ProductTag from '../elements/product-tag';

export function GridTileImage({
  isInteractive = true,
  product,
  active,
  label,
  index = 0,
  alt = 'image',
  collectionIndex = -1,
  ...props
}: {
  collectionIndex?: number;
  isInteractive?: boolean;
  active?: boolean;
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
  if (!product) return null;
  const productDescription = product?.metafields?.find((item: any) => item?.key === 'hp_excerpt');
  const setPriority = collectionIndex === 0 && (index === 0 || index === 1);

  return (
    <div
      className={clsx(
        ' flex w-full items-center  justify-center  overflow-hidden rounded-lg border bg-white',
        {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200': !active
        }
      )}
    >
      {props.src ? (
        <div className="flex h-full min-h-[320px] w-full flex-col justify-between md:max-h-[100%] md:min-h-[456px]">
          <div
            onClick={() => {
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
              <div className=" h-full w-full overflow-hidden object-cover">
                <Link href={`/product/${product?.handle}?option=${product.options[0].values[0]}`}>
                  <Image
                    className={clsx(
                      ' relative aspect-square h-full min-h-[200px] w-full object-cover  md:min-h-[300px]',
                      {
                        ' transition duration-500 ease-in-out group-hover:scale-125': isInteractive
                      }
                    )}
                    width={300}
                    height={300}
                    alt={alt}
                    quality={75}
                    loading={setPriority ? 'eager' : 'lazy'}
                    sizes="(max-width: 640px) 200px, 300px"
                    priority={setPriority ? setPriority : false}
                    {...props}
                  />
                  <ProductTag product={product} />
                </Link>
              </div>
              {product.ratings && product.ratings.average !== 0 && (
                <div className="absolute bottom-2 left-2 flex w-max flex-row justify-between  gap-1 rounded-sm bg-white px-1 py-[1px]  text-black">
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
                    style={{ transformOrigin: '0px 0px', opacity: 1, transform: 'scale(1, 1)' }}
                  >
                    {product.ratings.average}
                  </span>
                  <span style={{ display: 'none' }}>52</span>
                </div>
              )}
            </div>
            <div className=" px-2 pt-2">
              <div className="">
                <Link href={`/product/${product?.handle}?option=${product.options[0].values[0]}`}>
                  <p className="leading-2 line-clamp-1 cursor-pointer text-[12px] transition-all hover:text-purple-400 md:text-base md:leading-6">
                    {label?.title}
                  </p>
                </Link>
                <p className="line-clamp-1 text-[10px] leading-7 text-[#6e6e6e]  md:text-xs">
                  {productDescription?.value}
                </p>
              </div>
              <div className="t4s-product-price text-base font-medium">
                <span className="font-poppins text-base font-semibold" /> ₹ {label?.amount}
              </div>
            </div>
          </div>
          <div>
            <div className=" flex flex-row justify-between px-2 pb-1 text-xs">
              <p className="bottom-leftext text-[#008325]">B2G2</p>
              <p className="bottom-rightext text-red-400">Free Gift</p>
            </div>
            <Suspense fallback={null}>
              <AddToCartButton
                product={product}
                variants={product.variants}
                availableForSale={product?.availableForSale || false}
                buttonClasses={
                  'p-2 w-full relative flex flex-1 text-sm hover:text-purple-400  items-center justify-center text-base bg-black border border-black text-white  md:px-8 uppercase tracking-wide font-normal md:font-semibold'
                }
              />
            </Suspense>
          </div>
        </div>
      ) : null}
    </div>
  );
}
