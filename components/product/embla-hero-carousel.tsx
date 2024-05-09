/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useCallback, useEffect, useRef } from 'react';
import { EmblaCarouselType, EmblaEventType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
// import { NextButton, PrevButton, usePrevNextButtons } from './embla-hero-arrow-buttons';
// import { DotButton, useDotButton } from './embla-carousel-dots';

const TWEEN_FACTOR_BASE = 0.2;

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaHeroCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  // const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  // const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
  //   usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.hero_embla__parallax__layer') as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback((emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap?.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
        const tweenNode = tweenNodes.current[slideIndex] as HTMLElement;
        tweenNode.style.transform = `translateX(${translate}%)`;
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax);
  }, [emblaApi, tweenParallax]);

  return (
    <div className="hero_embla">
      <div className="hero_embla__viewport" ref={emblaRef}>
        <div className="hero_embla__container">
          {slides.map((index) => (
            <div className="hero_embla__slide " key={index}>
              <div className="hero_embla__parallax">
                <div className="hero_embla__parallax__layer">
                  <Image
                    priority
                    width={1200}
                    height={800}
                    className="hero_embla__slide__img embla__parallax__img"
                    src={`/Images/banner.png`}
                    alt="Your alt text"
                    loading="eager"
                    sizes="(max-width: 768px) 110vw, (min-width:1200px) 100vw"
                    quality={75} // Lower quality for smaller file size
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="hero_embla__controls ">
        <div className="hero_embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="hero_embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'hero_embla__dot'.concat(
                index === selectedIndex ? ' hero_embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default EmblaHeroCarousel;
