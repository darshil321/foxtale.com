'use client';
import Image from 'next/image';
import React from 'react';
import ResultsTabs from './results-tabs';
import { Product } from '@/lib/shopify/types';

type Props = {
  product: Product;
};

const ResultsSection = ({ product }: Props) => {
  const filteredDataByKey = product?.metafields?.find((item: any) => item?.key === 'custom-tab');

  function extractImageSources(htmlString: string, className: string) {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(htmlString, 'text/html');

    const resultImages = htmlDocument.querySelectorAll(`.${className}`);
    const imageSources = Array.from(resultImages).map((image) => image.getAttribute('src'));

    return imageSources;
  }

  const htmlString = filteredDataByKey?.value; // Assign your HTML string here
  const className = 'result-img'; // Define the class name you want to search for

  const imageSources = extractImageSources(htmlString, className);

  return (
    <div className="w-full px-4 py-3 md:px-0  md:py-10">
      <h2 className=" mb-3 text-2xl font-medium leading-7">Real People, Verified Results</h2>
      <div className="flex  flex-col gap-4 rounded-lg bg-grey lg:flex-row lg:gap-0 ">
        <div className="h-full w-full basis-full lg:basis-3/6">
          <Image
            className="h-full w-full"
            src={
              imageSources[0] ||
              'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Starlet-02.jpg'
            }
            alt="Foxtale"
            width={570}
            quality={100}
            loading="lazy"
            height={370}
          />
        </div>
        <div className="basis-full px-2 pb-4 pt-5 lg:basis-3/6">
          <ResultsTabs />
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
