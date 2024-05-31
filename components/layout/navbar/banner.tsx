'use client';
import React from 'react';
import { trackEvent } from 'utils/mixpanel';
import { sendGAEvent } from '@next/third-parties/google';

const Banner = () => {
  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    sendGAEvent({ event: 'Announcement Bar Clicked', value: {} });
    trackEvent('Announcement Bar Clicked', {});
  };

  return (
    <div onClick={handleBannerClick} className="bg-black bg-gradient-to-r text-white ">
      <div className="container mx-auto flex items-center justify-center py-1">
        <div className="text-white">
          <span className="text-sm  text-white">Exclusive prices for our new users!</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
