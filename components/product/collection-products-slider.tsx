import React from 'react';
import SelectCategory from './product-select';
// @ts-ignore
import EmblaCarousel from './product-embla-carousel';

export const ProductCarousel: React.FC<{
  selectedCategory: any;
  setSelectedCategory: any;
  slides: any[];
  options: any;
}> = ({ selectedCategory, setSelectedCategory, slides, options }) => {
  return (
    <div className="flex flex-col justify-start px-4 py-4 md:px-0 md:py-12">
      <div className="mb-6 ">
        <h2 className="flex flex-row items-center gap-3 text-2xl font-medium leading-7">
          Routines for{' '}
          <SelectCategory
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </h2>
      </div>
      <EmblaCarousel slides={slides} options={options} />
    </div>
  );
};
