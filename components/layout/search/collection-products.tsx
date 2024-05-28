'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setIsUserClicked, setSelectedCollection } from '@/store/slices/product-slice';
import { useAppSelector } from '@/store/hooks';
import Grid from '@/components/grid';
import ProductGridItems from '../product-grid-items';

const CollectionProductsContainer = ({
  collections,
  products,
  index
}: {
  collections: any;
  products: any;
  index: number;
  key?: number;
}) => {
  const dispatch = useDispatch();
  const selectedCollection = useAppSelector((state) => state.products.selectedCollection);
  const isUserClicked = useAppSelector((state) => state.products.isUserClicked);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  useEffect(() => {
    const topBar = document.querySelector('.sticky.top-0');
    if (topBar) {
      setTopBarHeight(topBar.clientHeight + 20);
    }
  }, []);
  useEffect(() => {
    if (selectedCollection === collections[index].section.toLowerCase() && isUserClicked) {
      const section = sectionRef.current;
      if (section) {
        const y = section.getBoundingClientRect().top + window.pageYOffset - topBarHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      dispatch(setIsUserClicked(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCollection, isUserClicked, collections, index, topBarHeight]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isUserClicked) {
        // Only dispatch if scroll was not triggered by a click
        const rect = sectionRef.current?.getBoundingClientRect();
        if (rect && rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          dispatch(setSelectedCollection(collections[index].section.toLowerCase()));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, collections, index, isUserClicked]);

  return (
    <section
      ref={sectionRef}
      id={collections[index]?.section.toLowerCase()}
      className="rounded-md bg-white px-1.5 py-2 md:order-none md:px-4 md:py-6"
      key={index}
    >
      <div className="space-y-1 px-1 pb-2 sm:px-3 md:px-5 md:pb-4">
        <h4 className=" text-base  font-[500] text-[#2C2C2C] md:text-xl">{`${collections[index]?.title}`}</h4>
        <p className="text-xs text-[#6E6E6E] ">{collections[index]?.Description}</p>
      </div>
      <Grid className="grid-cols-2 place-items-center gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        <ProductGridItems collectionIndex={index} products={products} />
      </Grid>
    </section>
  );
};

export default CollectionProductsContainer;
