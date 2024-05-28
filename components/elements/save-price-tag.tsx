'use client';
import React from 'react';

const SavePriceTag = ({ savePrice }: { savePrice: number | string }) => {
  return (
    <div className="absolute left-2 top-2 rounded-full bg-white  p-2 text-center text-xs uppercase  text-[#F05001]  md:left-4 md:top-5">
      <p>SAVE</p>
      <p className="font-bold">₹ {savePrice}</p>
    </div>
  );
};

export default SavePriceTag;
