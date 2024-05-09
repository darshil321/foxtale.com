import { appendReviewAndRating } from '@/lib/helper/helper';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const _products = await getProducts({ sortKey, reverse, query: searchValue });
  const products = await appendReviewAndRating(_products);
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mx-2 mt-4 text-base md:mx-4">
          {products.length === 0
            ? 'There are no products that match'
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className=" grid-cols-2 place-items-center py-2 sm:grid-cols-2 md:py-7 lg:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
