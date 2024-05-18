'use client';
import Image from 'next/image';
import React from 'react';
import { trackEvent } from 'utils/mixpanel';

const BannerImage = (imageUrl: string) => {
  const handleCollectionBannerClick = (url: string) => {
    trackEvent('Header Collection Clicked', { BannerUrl: url });
  };
  return (
    <div>
      <Image
        onClick={(e) => {
          e.preventDefault();
          handleCollectionBannerClick(imageUrl);
        }}
        priority
        height={475}
        width={920}
        objectFit="cover"
        className="hidden h-auto w-full rounded-md md:block"
        src={imageUrl}
        alt="Foxtale"
        quality={95}
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

export default BannerImage;
