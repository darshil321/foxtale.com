import React from 'react';
import Grid from 'components/grid';

const SkeletonLoader = () => {
  const generatePlaceholderItems = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="animate-pulse space-y-2">
          <div className="h-20 w-full rounded bg-neutral-200"></div>
          <div className="h-20 w-3/4 rounded bg-neutral-200"></div>
        </div>
      ));

  return (
    <section className="animate-pulse rounded-md bg-white px-1.5 py-2 md:order-none md:px-4 md:py-6">
      <div>
        <div className="space-y-1 px-1 pb-2 md:px-5 md:pb-4">
          <div className="h-20 w-full rounded bg-neutral-200"></div>
          <div className="h-20 w-1/2 rounded bg-neutral-200"></div>
        </div>
        <Grid className="grid-cols-2 place-items-center gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {generatePlaceholderItems(3)}
        </Grid>
      </div>
    </section>
  );
};

export default SkeletonLoader;
