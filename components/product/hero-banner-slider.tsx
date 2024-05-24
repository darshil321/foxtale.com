'use client';
import React from 'react';
import '../../assets/styles/hero-slider.css';
import Image from 'next/image';
import { trackEvent } from 'utils/mixpanel';
import { banner_1 } from '@/assets/base-64/banner-base64';

const HeroBannerSlider = () => {
  const handleCollectionBannerClick = (url: string) => {
    trackEvent('Header Collection Clicked', { BannerUrl: url });
  };

  return (
    <div className=" h-auto  max-h-[460px] w-full rounded-md">
      <Image
        blurDataURL={banner_1}
        onClick={(e: React.MouseEvent<HTMLImageElement>) => {
          e.preventDefault();
          handleCollectionBannerClick(
            'https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-04.jpg?v=1715687265'
          );
        }}
        priority
        height={475}
        width={770}
        objectFit="cover"
        className="hidden h-auto w-full rounded-md md:block"
        src={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-04.jpg?v=1715687265`}
        alt="foxtale"
        quality={90}
        placeholder="blur"
        loading="eager"
      />
      <Image
        onClick={(e: React.MouseEvent<HTMLImageElement>) => {
          e.preventDefault();
          handleCollectionBannerClick(
            'https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-03.jpg?v=1715687265'
          );
        }}
        priority
        height={140}
        width={220}
        objectFit="cover"
        className="block h-full w-full rounded-md md:hidden"
        src={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-03.jpg?v=1715687265`}
        alt="Foxtale"
        quality={90}
        blurDataURL={banner_1}
        placeholder="blur"
        loading="eager"
      />
    </div>
  );
};

export default HeroBannerSlider;
