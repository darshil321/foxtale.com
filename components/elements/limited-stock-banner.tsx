import Image from 'next/image';
import React from 'react';

const LimitedStockBanner = () => {
  return (
    <div className=" my-8 flex w-full flex-row items-center bg-[#fff9f3] p-5 ">
      <Image
        src="https://cdn.shopify.com/s/files/1/0609/6096/4855/files/5cd58b02f874279424cf3facf01b19db.png?v=1714045492"
        alt="Limited Stock Banner"
        width={100}
        height={100}
        layout="responsive"
        className="h-12 max-h-14 w-12 max-w-14 rounded-full border object-cover p-1"
      />
      <h4 className="mt-2 pl-6 text-center text-sm font-medium md:pl-8 md:text-xl">
        Limited stocks left at this price!
      </h4>
    </div>
  );
};

export default LimitedStockBanner;
