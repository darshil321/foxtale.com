import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  alt = 'image',
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  alt?: string;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        ' flex h-full w-full items-center justify-center  overflow-hidden rounded-lg border bg-white hover:border-blue-600 ',
        {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200': !active
        }
      )}
    >
      {props.src ? (
        <div className="">
          <div className="relative ">
            <a href="/products/purify-glow-cleanser-mask">
              <style
                dangerouslySetInnerHTML={{
                  __html:
                    '\n  @keyframes blinker {\n 50% { opacity: 0; }\n  }\n  .blink_me { animation: blinker 1.5s linear infinite; }\n'
                }}
              />
              <Image
                className={clsx(
                  'relative aspect-square h-full w-full  overflow-hidden object-cover',
                  {
                    'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
                  }
                )}
                width={300}
                height={300}
                alt={alt}
                {...props}
              />
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
            </a>
          </div>
          <div className="product-info p-2">
            <div className="">
              <h3 className="product-title pr fs__14 mg__0 fwm">
                <Link
                  className=" md:text-md leading-2 line-clamp-2 text-[13px] font-semibold md:text-sm md:leading-7"
                  href={'/products/purify-glow-cleanser-mask'}
                >
                  {label?.title}
                </Link>
              </h3>
              <p className="text-[10px] text-[#6e6e6e]  md:text-sm">
                Cleanser + exfoliating facial
              </p>
            </div>
            <span className="price dib mb__5">
              <div className="t4s-product-price" data-pr-price data-product-price>
                <span className="text-base  font-semibold" /> ₹ {label?.amount}
              </div>
            </span>
          </div>
          <div className="flex w-full items-center justify-center overflow-hidden rounded-b-sm bg-black p-4">
            <Link href="/products/purify-glow-cleanser-mask">
              <span className=" flex self-center text-center text-[8px] font-semibold uppercase text-white md:text-xs">
                Add to cart
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
