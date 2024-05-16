import '../../assets/styles/hero-slider.css';
import Image from 'next/image';

const HeroBannerSlider = () => {
  return (
    <div>
      <div className=" h-auto  max-h-[460px] w-full rounded-md">
        <Image
          priority
          height={475}
          width={570}
          objectFit="cover"
          className="hidden h-auto w-full rounded-md md:block"
          src={`https://foxtale.in/cdn/shop/files/DEKSTOP.jpg?v=1715167462`}
          alt="Your alt text"
          quality={80}
        />
        <Image
          priority
          height={340}
          width={360}
          objectFit="cover"
          className="block h-full w-full rounded-md md:hidden"
          src={`https://foxtale.in/cdn/shop/files/MOBILE_35.jpg?v=1715167461`}
          alt="Your alt text"
        />
      </div>
    </div>
  );
};

export default HeroBannerSlider;
