import clsx from 'clsx';
import { AddToCartButton } from 'components/cart/add-to-cart-button';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export function GridTileImage({
  isInteractive = true,
  product,
  active,
  label,
  alt = 'image',
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  product?: any;
  alt?: string;
  label?: {
    title: string;
    amount: string;
    description?: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        ' flex h-full w-full items-center  justify-center  overflow-hidden rounded-lg border bg-white',
        {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200': !active
        }
      )}
    >
      {props.src ? (
        <div className="flex min-h-[456px] flex-col justify-between">
          <div>
            <div className="relative ">
              <div className="group overflow-hidden">
                <Image
                  className={clsx(
                    ' relative aspect-square h-auto min-h-[300px] w-auto  object-cover',
                    {
                      ' transition duration-500 ease-in-out group-hover:scale-125': isInteractive
                    }
                  )}
                  width={300}
                  height={300}
                  alt={alt}
                  {...props}
                />
              </div>

              <div className="absolute bottom-2 left-2 flex w-max flex-row justify-between  gap-1 rounded-sm bg-white px-1 py-[1px]  text-black">
                <div
                  className="fera-stars fera-productReviewsSummary-stars fera-productReviewsSummary-reviews-verification-popover"
                  data-verified-review-count={50}
                  data-rating="4.8"
                >
                  <div
                    className="fera-stars-rating fera-productReviewsSummary-stars-rating"
                    style={{ width: '96.0%' }}
                  >
                    ★
                  </div>
                  <div className="fera-stars-bg fera-productReviewsSummary-stars-bg" />
                </div>
                <span
                  className=" fera-productReviewsSummary-avgRating"
                  data-value="4.8"
                  style={{ transformOrigin: '0px 0px', opacity: 1, transform: 'scale(1, 1)' }}
                >
                  4.8
                </span>
                <span style={{ display: 'none' }}>52</span>
              </div>
            </div>
            <div className="product-info p-2">
              <div className="">
                <Link href={`/product/${product?.handle}`}>
                  <h3 className=" md:text-md leading-2 line-clamp-2 cursor-pointer text-[13px] font-semibold transition-all hover:text-purple-400 md:text-sm md:leading-6">
                    {label?.title}
                  </h3>
                </Link>
                <p className="text-[10px] leading-7 text-[#6e6e6e]  md:text-sm">
                  {label?.description}
                </p>
              </div>
              <span className="price dib mb__5">
                <div className="t4s-product-price" data-pr-price data-product-price>
                  <span className="font-poppins text-base font-bold" /> ₹ {label?.amount}
                </div>
              </span>
            </div>
          </div>
          <div className="flex w-full items-center justify-center overflow-hidden rounded-b-sm bg-black p-4">
            <span className=" flex self-center text-center text-[8px] font-semibold uppercase text-white md:text-xs">
              <Suspense fallback={null}>
                <AddToCartButton
                  variants={product?.variants}
                  availableForSale={product?.availableForSale || false}
                  buttonClasses={
                    'relative flex  flex-1 text-sm hover:text-purple-400  items-center justify-center text-base bg-black border border-black text-white  px-6  md:px-8 uppercase tracking-wide font-normal md:font-semibold'
                  }
                />
              </Suspense>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
