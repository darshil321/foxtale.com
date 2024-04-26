import Image from 'next/image';
import React from 'react';
import ResultsTabs from './results-tabs';

const ResultsSection = () => {
  return (
    <div className="w-full px-4 py-3 md:px-0  md:py-10">
      <h2 className=" mb-3 text-2xl  font-semibold">Real People, Verified Results</h2>
      <div className="flex  flex-col gap-4 rounded-lg bg-grey lg:flex-row lg:gap-0 ">
        <div className="h-full w-full basis-full lg:basis-3/6">
          <Image
            className="h-full w-full"
            src={
              'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Matte_Finish_Sunscreen_SPF_70_-02_a0aed983-4981-464f-b9a0-1445eb24963c.jpg?v=1685299985'
            }
            alt="Foxtale"
            width={570}
            height={370}
          />
        </div>
        <div className="basis-full px-5 pb-4 pt-5 lg:basis-3/6">
          <ResultsTabs />
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
