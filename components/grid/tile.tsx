import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

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
          <div className="flex h-full w-full flex-col">
            <div className="relative">
              <div className=" h-full w-full overflow-hidden object-cover">
                <Link href={`/product/${product?.handle}`}>
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
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 640px) 200px, 300px"
                    {...props}
                  />
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
            <div className="product-info p-2">
              <div className="">
                <Link href={`/product/${product?.handle}`}>
                  <h3 className=" md:text-md leading-2 line-clamp-2 cursor-pointer text-[13px] font-semibold transition-all hover:text-purple-400 md:text-sm md:leading-6">
                    {label?.title}
                  </h3>
                </Link>
                <p className="text-[10px] leading-7 text-[#6e6e6e]  md:text-xs">
                  {label?.description?.slice(0, 40)}
                </p>
              </div>
              <span className="price dib mb__5">
                <div className="t4s-product-price" data-pr-price data-product-price>
                  <span className="font-poppins text-base font-bold" /> ₹ {label?.amount}
                </div>
              </span>
            </div>
          </div>
          <div className="flex w-full items-center justify-center overflow-hidden rounded-b-sm bg-black p-2 md:p-4">
            <span className=" flex self-center text-center text-[8px] font-semibold uppercase text-white md:text-xs">
              <Suspense fallback={null}>
                <AddToCartButton
                  product={product}
                  variants={product.variants}
                  availableForSale={product?.availableForSale || false}
                  buttonClasses={
                    'relative flex  flex-1 text-sm hover:text-purple-400  items-center justify-center text-base bg-black border border-black text-white  md:px-8 uppercase tracking-wide font-normal md:font-semibold'
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
