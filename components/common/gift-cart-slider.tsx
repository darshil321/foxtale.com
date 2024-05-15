'use client';
import React from 'react';
// @ts-ignore

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { EmblaOptionsType } from 'embla-carousel';

type PropType = {
  slides: any[];
  options?: EmblaOptionsType;
};

const EmblaCartSlider: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef] = useEmblaCarousel(options, [Autoplay()]);

  return (
    <section className="embla_product ">
      <div className="embla_product__viewport " ref={emblaRef}>
        <div className="embla_product__container h-full w-full">
          {slides.map((product, index) => (
            <div key={index} className="embla_cart__slide ">
              <div className=" mr-2 flex flex-row justify-between gap-2 rounded-sm border p-2 ">
                <Image
                  className="aspect-square h-[80px] w-[80px] rounded-sm object-cover "
                  width={80}
                  height={80}
                  alt={
                    product?.merchandise?.product?.images?.edges[0]?.node?.altText ||
                    product?.merchandise?.product?.title
                  }
                  src={product?.merchandise?.product?.images?.edges[0]?.node?.url as string}
                  quality={80}
                />
                <div className="flex flex-col gap-1 py-4">
                  <span className="text-sm leading-tight">
                    {product.merchandise.product.title.substring(0, 15)}
                    {product.merchandise.product.title?.length > 15 && '...'}
                  </span>
                  <p className="text-sm"> ₹ {product.merchandise.price.amount}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <button className="bg-black px-4 py-1 text-white">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCartSlider;
