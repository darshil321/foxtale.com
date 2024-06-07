import Image from 'next/image';
import React from 'react';

const LimitedStockBanner = () => {
  return (
    <div className="px-3">
      <div className=" my-1 flex w-full items-center bg-[#fff9f3] p-3  md:p-5 ">
        <Image
          src="https://cdn.shopify.com/s/files/1/0609/6096/4855/files/5cd58b02f874279424cf3facf01b19db.png?v=1714045492"
          alt="Limited Stock Banner"
          width={100}
          height={100}
          layout="responsive"
          className="h-6 max-h-8 w-6 max-w-8 rounded-full border object-cover  p-1    md:h-12 md:max-h-14 md:w-12 md:max-w-14"
        />
        <h4 className=" px-2 text-left text-xs font-medium md:px-8 md:text-lg">
          Limited stocks left at this price!
        </h4>
      </div>
    </div>
  );
};

export default LimitedStockBanner;
