'use client';
import React from 'react';
import '../../assets/styles/hero-slider.css';
import Image from 'next/image';
import { trackEvent } from 'utils/mixpanel';

const HeroBannerSlider = () => {
  const handleCollectionBannerClick = (url: string) => {
    trackEvent('Header Collection Clicked', { BannerUrl: url });
  };
  return (
    <div className=" h-auto  max-h-[460px] w-full rounded-md">
      <Image
        onClick={(e: React.MouseEvent<HTMLImageElement>) => {
          e.preventDefault();
          handleCollectionBannerClick(
            'https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-04.jpg?v=1715687265'
          );
        }}
        priority
        height={475}
        blurDataURL={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-04.jpg?v=1715687265`}
        width={770}
        objectFit="cover"
        className="hidden h-auto w-full rounded-md md:block"
        src={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-04.jpg?v=1715687265`}
        alt="foxtale"
        quality={20}
        placeholder="blur"
      />
      <Image
        onClick={(e: React.MouseEvent<HTMLImageElement>) => {
          e.preventDefault();
          handleCollectionBannerClick(
            'https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-03.jpg?v=1715687265'
          );
        }}
        priority
        height={240}
        blurDataURL={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-03.jpg?v=1715687265`}
        width={360}
        objectFit="cover"
        className="block h-full w-full rounded-md md:hidden"
        src={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-03.jpg?v=1715687265`}
        alt="Foxtale"
        quality={90}
        placeholder="blur"
      />
    </div>
  );
};

export default HeroBannerSlider;
