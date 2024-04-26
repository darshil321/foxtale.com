'use client';

import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

const EditItemForm: React.FC = () => {
  return (
    <div className="">
      <h3>Hydrating Moisturizer with Ceramide</h3>
      <span className="mt-8 text-2xl text-gray-600">₹ 445</span>
      <div className="mt-2 flex w-full gap-1">
        <button className="flex w-1/2 flex-col items-center justify-center rounded-sm bg-black px-5 py-2 text-white">
          <span className="text-center">Single</span>
          <span className="text-center">₹ 445</span>
        </button>
        <button className="flex w-1/2 flex-col items-center justify-center rounded-sm border border-black px-5 py-2">
          <span className="text-center">Pack of 2</span>
          <span className="text-center">
            <span className="text-black line-through">₹ 890</span>
            <span>₹ 845</span>{' '}
          </span>
        </button>
      </div>
      <div className="mt-2 flex text-center">
        <span className="flex h-10 w-[120px] items-center justify-between  border border-black px-3">
          <FiMinus className="cursor-pointer text-lg text-black" />
          <span>{4}</span>
          <FiPlus className="cursor-pointer text-lg text-black" />
        </span>
      </div>
      <button className="mt-4 w-full bg-black px-5 py-2 text-white">REPLACE ITEM</button>
    </div>
  );
};

export default EditItemForm;
