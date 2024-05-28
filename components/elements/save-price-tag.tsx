'use client';
import React from 'react';

const SavePriceTag = ({ savePrice }: { savePrice: number | string }) => {
  return (
    <div className="absolute left-4 top-5 rounded-full bg-white p-2 text-center  text-xs  uppercase text-[#F05001]">
      <p>SAVE</p>
      <p className="font-bold">₹ {savePrice}</p>
    </div>
  );
};

export default SavePriceTag;
