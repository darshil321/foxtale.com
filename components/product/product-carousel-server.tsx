'use client';
import React from 'react';
// @ts-ignore
import { EmblaOptionsType } from 'embla-carousel';
import { getCollectionProducts } from 'lib/shopify';
import { ProductCarousel } from './collection-products-slider';
import '../../assets/styles/embla-css.css';

const OPTIONS: EmblaOptionsType = { align: 'end', loop: true };
const categories = [{ name: 'fine-lines' }, { name: 'acne-collection' }, { name: 'blemish-prone' }];

export default function ProductCarouselServer() {
  const [selectedCategory, setSelectedCategory] = React.useState(categories[0]);
  const [slides, setSlides] = React.useState([]) as any;

  // Fetch products or any other data you need
  React.useEffect(() => {
    const fetchData = async () => {
      const products = await getCollectionProducts({
        collection: selectedCategory?.name as string
      });
      setSlides(products);
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <ProductCarousel
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      slides={slides}
      options={OPTIONS}
    />
  );
}
