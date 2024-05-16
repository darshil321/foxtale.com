'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { EmblaOptionsType } from 'embla-carousel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { cartActions } from '@/store/actions/cart.action';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultVariant } from '@/lib/helper/helper';

type PropType = {
  slides: any[] | undefined;
  options?: EmblaOptionsType;
  type: string;
};

const EmblaProductSlider: React.FC<PropType> = (props) => {
  const { slides, options, type } = props;
  const [emblaRef] = useEmblaCarousel(options);
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);

  const onClick = (item: any) => {
    console.log('item', item);
    const isInCart = cart?.lines.some(
      (cartItem: any) =>
        getDefaultVariant(cartItem.merchandise.product) ===
        getDefaultVariant(item.product, item.variantId)
    );

    if (!isInCart) {
      dispatch(
        cartActions.addToCart({
          selectedVariantId: item.variantId,
          product: item.product,
          tempId: uuidv4(),
          isLoading: true
        })
      );
    }
  };

  if (!slides) return <></>;
  return (
    <section className="embla_product ">
      <div className="embla_product__viewport " ref={emblaRef}>
        <div className="embla_product__container h-full w-full">
          {slides.map(({ product, variantId }, index) => {
            const productDescription = product?.metafields?.find(
              (item: any) => item?.key === 'hp_excerpt'
            );
            const isInCart = cart?.lines?.some(
              (cartItem: any) => cartItem.selectedVariantId === variantId
            );

            return (
              <div key={index} className="embla_cart__slide ">
                <div className=" mr-2 flex flex-row justify-between gap-2 rounded-sm border p-2 ">
                  <div className="flex flex-row gap-4">
                    <Image
                      className="aspect-square h-[80px] w-[80px] rounded-sm object-cover "
                      width={80}
                      height={80}
                      alt={product?.images[0]?.altText || product?.title}
                      src={product?.images[0]?.url || '/Images/default.png'}
                      quality={80}
                    />
                    <div
                      className={`${type === 'product' ? 'flex flex-col items-start gap-1 py-2' : 'flex items-center'}`}
                    >
                      <span className="text-sm leading-tight">
                        {product?.title?.substring(0, 15)}
                        {product?.title?.length > 15 && '...'}
                      </span>
                      <p className="text-xs text-[#6d6e71]">
                        {productDescription?.value.substring(0, 15)}
                      </p>

                      {type === 'product' && (
                        <p className="text-sm">${product?.variants[0]?.price?.amount}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <button
                      disabled={isInCart}
                      onClick={() => onClick({ product, variantId })}
                      className="bg-black px-4 py-1 text-white"
                    >
                      {isInCart ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EmblaProductSlider;
