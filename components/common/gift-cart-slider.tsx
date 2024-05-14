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
  console.log('slides', slides);
  const [emblaRef] = useEmblaCarousel(options, [Autoplay()]);

  return (
    <section className="embla_product">
      <div className="embla_product__viewport " ref={emblaRef}>
        <div className="embla_product__container h-full">
          {slides.map((product, index) => (
            <div className="embla_cart__slide flex flex-row justify-between gap-2" key={index}>
              <Image
                className=" aspect-square h-[80px] w-[80px] object-cover "
                width={80}
                height={80}
                alt={
                  product.merchandise.product.images.edges[0].node.altText ||
                  product.merchandise.product.title
                }
                src={product.merchandise.product.images.edges[0].node.url as string}
                quality={80}
              />

              <div className="flex flex-col">
                <h4 className="text-sm">{product.merchandise.product.title}</h4>
                <p> {product.merchandise.price.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCartSlider;
