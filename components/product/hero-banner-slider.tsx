// // @ts-ignore
// import { EmblaOptionsType } from 'embla-carousel';
// import EmblaHeroCarousel from './embla-hero-carousel';
import '../../assets/styles/hero-slider.css';
import Image from 'next/image';
// import { EmblaCarouselType, EmblaEventType, EmblaOptionsType } from 'embla-carousel';
// const OPTIONS: EmblaOptionsType = { dragFree: false, loop: true };
// const SLIDE_COUNT = 5;
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const HeroBannerSlider = () => {
  return (
    <div>
      {/* <EmblaHeroCarousel slides={SLIDES} options={OPTIONS} /> */}{' '}
      <div className="hero_embla__parallax__layer ">
        <Image
          priority
          height={475}
          width={470}
          objectFit="cover"
          className="hero_embla__slide__img embla__parallax__img"
          src={`/Images/banner.png`}
          sizes="(max-width: 768px) 70vw"
          alt="Your alt text"
          quality={80}
        />
      </div>
    </div>
  );
};

export default HeroBannerSlider;
