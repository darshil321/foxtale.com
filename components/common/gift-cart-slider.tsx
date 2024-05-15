'use client';
import React from 'react';
// @ts-ignore

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { EmblaOptionsType } from 'embla-carousel';
import { Product } from '@/lib/shopify/types';
import { useAppDispatch } from '@/store/hooks';
import { cartActions } from '@/store/actions/cart.action';
import { v4 as uuidv4 } from 'uuid';

type PropType = {
  slides: { product: Product; variantId: string }[] | undefined;
  options?: EmblaOptionsType;
};

const EmblaCartSlider: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef] = useEmblaCarousel(options, [Autoplay()]);
  const dispatch = useAppDispatch();
  // const getVariant = (product: Product, variantId: string) => {
  //   return {
  //     ...product,
  //     variant: product.variants.find((variant) => variant.id === variantId)
  //   };
  // };

  const onClick = (item: any) => {
    dispatch(
      cartActions.addToCart({
        selectedVariantId: item.variantId,
        product: item.product,
        tempId: uuidv4()
      })
    );
  };
  if (!slides) return <></>;
  return (
    <section className="embla_product">
      <div className="embla_product__viewport " ref={emblaRef}>
        <div className="embla_product__container h-full w-full">
          {slides.map(({ product, variantId }, index) => (
            <div className="embla_cart__slide flex flex-row justify-between gap-2" key={index}>
              <Image
                className=" aspect-square h-[80px] w-[80px] object-cover "
                width={80}
                height={80}
                alt={product?.images[0]?.altText || product?.title}
                src={product?.images[0]?.url as string}
                quality={80}
              />

              <button onClick={() => onClick({ product, variantId })}>add </button>
              <div className="flex flex-col">
                <h4 className="text-sm">{product?.title}</h4>

                {/* <p> {getVariant(product, variantId)?.variant.price.amount}</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCartSlider;
