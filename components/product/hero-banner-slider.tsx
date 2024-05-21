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
        blurDataURL={`https://foxtale-com-git-plan-a-darshils-projects-1d319060.vercel.app/_next/image?url=https%3A%2F%2Ffoxtale.in%2Fcdn%2Fshop%2Ffiles%2FFoxtale_bestsellers_banners-04.jpg%3Fv%3D1715687265&w=1920&q=20`}
        width={770}
        objectFit="cover"
        className="hidden h-auto w-full rounded-md md:block"
        src={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-04.jpg?v=1715687265`}
        alt="foxtale"
        quality={90}
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
        quality={40}
        placeholder="blur"
      />
    </div>
  );
};

export default HeroBannerSlider;
