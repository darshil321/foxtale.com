import { getCollection, getCollectionProducts, getCollections } from 'lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';

export const generateStaticParams = async () => {
  const collections = await getCollections();
  return collections?.map((collection: any) => ({
    collection: collection?.handle
  }));
};

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.collection);
  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function CategoryPage({
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const collections = [
    {
      handle: 'cleansers'
    },
    {
      handle: 'Sunscreens'
    },
    {
      handle: 'moisturizers'
    },
    {
      handle: 'serums'
    }
  ];

  // Fetch products for all collections simultaneously
  const promises = collections.map((collection) =>
    getCollectionProducts({ collection: collection.handle, sortKey, reverse })
  );

  const productsByCollection = await Promise.all(promises);

  return (
    <div className="h-full w-full gap-4 space-y-6">
      {productsByCollection?.map((products, index) => (
        <section
          id={collections[index]?.handle.toLowerCase()}
          className=" rounded-md bg-white px-1.5 py-2 md:order-none md:px-4 md:py-6"
          key={index}
        >
          <div>
            <div className="space-y-1 px-1 pb-2 md:px-5 md:pb-4">
              <h1 className="text-base md:text-xl">{`Products in ${collections[index]?.handle}`}</h1>
              <p className="text-xs text-[#6E6E6E] md:text-sm">{`Showing ${products?.length} results`}</p>
            </div>
            <Grid className="grid-cols-2 place-items-center gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <ProductGridItems products={products} />
            </Grid>
          </div>
        </section>
      ))}
    </div>
  );
}
