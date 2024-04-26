import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProductCard = () => {
  return (
    <div className="rounded-sm border shadow md:w-full ">
      <div className="">
        <h6 className=" flex w-full items-center justify-center bg-black text-xs uppercase leading-6 tracking-wider text-white md:text-sm">
          Cleanse
        </h6>
        <div className="relative">
          <a href="/products/purify-glow-cleanser-mask">
            <style
              dangerouslySetInnerHTML={{
                __html:
                  '\n  @keyframes blinker {\n 50% { opacity: 0; }\n  }\n  .blink_me { animation: blinker 1.5s linear infinite; }\n'
              }}
            />
            <Image
              className="h-full w-full object-cover "
              src="https://foxtale.in/cdn/shop/files/PDP---First-Image-07.jpg?v=1712244647"
              width={300}
              height={300}
              alt="Purify &amp; Glow Cleanser + Mask"
            />
          </a>
          <div className="absolute bottom-2 left-2 flex w-max flex-row  justify-between gap-1 rounded-sm bg-white px-1 py-[1px]  text-black">
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
        <div className="product-info  product-innr-bottom p-2">
          <div className="">
            <h3 className="product-title pr fs__14 mg__0 fwm">
              <a
                className=" md:text-md leading-2 text-[13px] font-semibold md:text-sm md:leading-7"
                href="/products/purify-glow-cleanser-mask"
              >
                Purify &amp; Glow Cleanser + Mask
              </a>
            </h3>
            <p className="text-[10px] text-[#6e6e6e]  md:text-sm">Cleanser + exfoliating facial</p>
          </div>
          <span className="price dib mb__5">
            <div className="t4s-product-price" data-pr-price data-product-price>
              <span className="text-base  font-semibold" /> ₹ 395
            </div>
          </span>
        </div>
      </div>
      <div className="flex w-full items-center justify-center overflow-hidden rounded-b-sm bg-black p-4">
        <Link href="/products/purify-glow-cleanser-mask">
          <span className=" flex self-center text-center text-[8px] font-semibold uppercase text-white md:text-xs">
            Add to cart
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
