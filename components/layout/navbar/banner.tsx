'use client';
import React from 'react';
import { fbEvent } from 'utils/facebook-pixel';
import { trackEvent } from 'utils/mixpanel';

const Banner = () => {
  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    trackEvent('Announcement Bar Clicked', {});
    fbEvent('Announcement Bar Clicked', {});
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
