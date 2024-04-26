'use client';

import React from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import '../../assets/styles/embla-css.css';
import EmblaCarousel from './product-embla-carousel';
import ProductSelect from './product-select';

const OPTIONS: EmblaOptionsType = { align: 'end', loop: true };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export const ProductCarousel: React.FC = () => (
  <div className="flex flex-col justify-start px-4 py-4 md:px-0 md:py-12">
    <div className="mb-6 ">
      <h2 className="flex flex-row items-center gap-3 text-2xl font-semibold">
        Routines for <ProductSelect />
      </h2>
    </div>
    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
  </div>
);
