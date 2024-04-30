import { EmblaOptionsType } from 'embla-carousel';
import EmblaHeroCarousel from './embla-hero-carousel';
import '../../assets/styles/hero-slider.css';

const OPTIONS: EmblaOptionsType = { dragFree: false, loop: true };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const HeroBannerSlider = () => {
  return (
    <div>
      <EmblaHeroCarousel slides={SLIDES} options={OPTIONS} />
    </div>
  );
};

export default HeroBannerSlider;
