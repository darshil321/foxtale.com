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
      <div className=" h-auto  max-h-[460px] w-full rounded-md">
        <Image
          priority
          height={475}
          width={470}
          objectFit="cover"
          className="hidden h-auto w-full rounded-md md:block"
          src={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-04.jpg?v=1715687265`}
          alt="Your alt text"
          quality={80}
        />
        <Image
          priority
          height={240}
          width={360}
          objectFit="cover"
          className="block h-full w-full rounded-md md:hidden"
          src={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-03.jpg?v=1715687265`}
          alt="Your alt text"
          quality={80}
        />
      </div>
    </div>
  );
};

export default HeroBannerSlider;
