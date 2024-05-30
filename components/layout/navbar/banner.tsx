'use client';
import React from 'react';
import { trackEvent } from 'utils/mixpanel';

const Banner = () => {
  const dynamicValue = 'FOX499';
  const staticPart = '[ Code: ';
  const closingBracket = ' ]';

  const result = staticPart + dynamicValue + closingBracket;

  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    trackEvent('Announcement Bar Clicked', {});
  };

  return (
    <div onClick={handleBannerClick} className="bg-black bg-gradient-to-r text-white ">
      <div className="container mx-auto flex items-center justify-center py-1">
        <div className="text-white">
          <span className="text-sm font-semibold text-white">
            Buy singles @flat ₹399 or ₹499&nbsp;
          </span>
          <a href="#" rel="noopener noreferrer" className="text-sm">
            {result}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
