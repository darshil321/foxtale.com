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
  const collections = await getCollections().then((res) =>
    res?.map((collection: any) => ({
      collection: collection?.handle === '' ? 'all' : collection?.handle
    }))
  );
  console.log('collectionswww', collections);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });
  return (
    <section className="rounded-md py-2 md:py-6">
      {products.length === 0 ? (
        <p className="px-4 py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <div>
          <div className="space-y-1 px-1 pb-2 md:px-5 md:pb-4">
            <h1 className=" text-base md:text-xl">{`Products in ${params.collection}`}</h1>
            <p className=" text-xs text-[#6E6E6E] md:text-sm">{`Showing ${products.length} results`}</p>
          </div>
          <Grid className="grid-cols-2 place-items-center gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <ProductGridItems products={products} />
          </Grid>
        </div>
      )}
    </section>
  );
}
