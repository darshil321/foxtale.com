'use client';
import React, { useCallback } from 'react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { PrevButton, NextButton, usePrevNextButtons } from './embla-carousel-arrow-buttons';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

type Images = {
  url: string;
  altText: string;
};
type PropType = {
  slides: Images[];
  options?: EmblaOptionsType;
};

const EmblaCarouselSlider: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false ? autoplay.reset : autoplay.stop;

    resetOrStop();
  }, []);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi, onNavButtonClick);

  return (
    <section className="embla_product relative px-4 md:px-0">
      <div className="embla_product__viewport " ref={emblaRef}>
        <div className="embla_product__container">
          {slides.map((image, index) => (
            <div className="embla_product__slide" key={index}>
              <Image
                className="p  aspect-square h-full w-full object-cover  md:w-full  md:max-w-[470px]"
                width={500}
                height={500}
                alt={image.altText as string}
                src={image?.url as string}
                priority={true}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="embla_product__controls absolute left-0 right-0 top-1/2 translate-y-[-50%] ">
        <div className="hidden w-full justify-between md:flex ">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
};

export default EmblaCarouselSlider;
