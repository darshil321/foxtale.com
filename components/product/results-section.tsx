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
    console.log('htmlDocument', htmlString);

    const resultImages = htmlDocument.querySelectorAll(`.${className}`);
    const imageSources = Array.from(resultImages).map((image) => image.getAttribute('src'));

    return imageSources;
  }

  function extractTwoImageSources(htmlString: any, id1: string, id2: string, className: string) {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(htmlString, 'text/html');

    const result1Images = htmlDocument.querySelectorAll(`#${id1} .${className}`);
    const result2Images = htmlDocument.querySelectorAll(`#${id2} .${className}`);

    const imageSources = [
      ...Array.from(result1Images).map((image) => image.getAttribute('src')),
      ...Array.from(result2Images).map((image) => image.getAttribute('src'))
    ];

    return imageSources;
  }

  const htmlString = filteredDataByKey?.value;
  const className = 'result-img';

  const imageSources = extractImageSources(htmlString, className);
  const imageSources2 = extractTwoImageSources(
    htmlString,
    'result1',
    'result2',
    'result-after-img'
  );

  return (
    <div className="w-full px-4 py-3 md:px-0  md:py-10">
      <h2 className=" mb-3 text-[21px] font-semibold leading-8 md:text-2xl">
        Real People, Verified Results
      </h2>
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
          <ResultsTabs images={imageSources2} />
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
