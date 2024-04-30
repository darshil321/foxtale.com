'use client';

import React, { useState, useEffect } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import '../../assets/styles/embla-css.css';
import EmblaCarousel from './product-embla-carousel';
import SelectCategory from './product-select';
import { getCollectionProducts } from 'lib/shopify';

const OPTIONS: EmblaOptionsType = { align: 'end', loop: true };
const categories = [{ name: 'Glow' }, { name: 'Anti Aging' }, { name: 'Sunscreen' }];

export const ProductCarousel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [slides, setSlides] = useState([]) as any;
  console.log('selectedCategory', selectedCategory);

  useEffect(() => {
    // Mock function to fetch products by category
    const fetchProducts = async (selectedCategory: any) => {
      const products = await getCollectionProducts({
        collection: selectedCategory?.name
      });
      console.log('productswithcategorylllll', products);

      setSlides(products);
    };

    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex flex-col justify-start px-4 py-4 md:px-0 md:py-12">
      <div className="mb-6 ">
        <h2 className="flex flex-row items-center gap-3 text-2xl font-semibold">
          Routines for{' '}
          <SelectCategory
            selectedCategory={selectedCategory as any}
            setSelectedCategory={setSelectedCategory as any}
          />
        </h2>
      </div>
      <EmblaCarousel slides={slides} options={OPTIONS} />
    </div>
  );
};
