import { EmblaOptionsType } from 'embla-carousel';
import '../../assets/styles/embla-products-carousel.css';
import EmblaCarouselSlider from './product-carousel-slider';

const OPTIONS: EmblaOptionsType = { align: 'start' };

export const ProductSlider = ({ images }: { images: any[] }) => {
  return (
    <>
      <EmblaCarouselSlider slides={images} options={OPTIONS} />
    </>
  );
};
