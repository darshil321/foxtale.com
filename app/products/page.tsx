// import { appendReviewAndRating } from '@/lib/helper/helper';
// import dynamic from 'next/dynamic';
// const Grid = dynamic(() => import('components/grid'));
// const ProductGridItems = dynamic(() => import('components/layout/product-grid-items'));
// import { defaultSort, sorting } from 'lib/constants';
// import { getProducts } from 'lib/shopify';
// import { Suspense } from 'react';
// import Loading from './loading';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // const { sort, q: searchValue } = searchParams as { [key: string]: string };
  // const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // const _products = await getProducts({ sortKey, reverse, query: searchValue });
  // const products = await appendReviewAndRating(_products);
  // const resultsText = products.length > 1 ? 'results' : 'result';
  return (
    // <div className="rounded-md bg-white ">
    //   {searchValue ? (
    //     <p className="mx-2 pt-2 text-base md:mx-4 ">
    //       {products.length === 0
    //         ? 'There are no products that match'
    //         : `Showing ${products.length} ${resultsText} for `}
    //       <span className="font-bold">&quot;{searchValue}&quot;</span>
    //     </p>
    //   ) : null}
    //   {products.length > 0 ? (
    //     <div className=" rounded-md bg-white px-1.5 py-2 md:order-none md:px-4 md:py-6">
    //       <Suspense fallback={<Loading />}>
    //         <Grid className=" grid-cols-2 place-items-center py-2 sm:grid-cols-2 md:py-7 lg:grid-cols-4">
    //           <ProductGridItems products={products} />
    //         </Grid>
    //       </Suspense>
    //     </div>
    //   ) : null}
    // </div>
    <></>
  );
}
