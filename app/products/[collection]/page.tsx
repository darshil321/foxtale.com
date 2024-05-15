import { getCollection, getCollectionProducts } from 'lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultSort, sorting } from 'lib/constants';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Loading from '../loading';

const CollectionProductsContainer = dynamic(
  () => import('@/components/layout/search/collection-products')
);

// export const generateStaticParams = async () => {
//   const collections = await getCollections();

//   return collections?.map((collection: any) => ({
//     collection: collection?.handle === '' ? 'all' : collection?.handle
//   }));
// };

// export const fetchCache = 'force-cache';

export const generateStaticParams = async () => {
  return [
    {
      collection: 'all'
    }
  ];
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
  const promises = collections.map(
    async (collection) =>
      await getCollectionProducts({ collection: collection.handle, sortKey, reverse })
  );

  const productsByCollection = await Promise.all(promises);
  console.log('data in server >>>>>>>>>>>>>>>', productsByCollection);

  return (
    <>
      <div className="h-full w-full gap-4 space-y-6 ">
        {productsByCollection?.map((products, index) => (
          <Suspense fallback={<Loading />} key={index}>
            <CollectionProductsContainer
              key={index}
              index={index}
              collections={collections}
              products={products}
            />
          </Suspense>
        ))}
      </div>
    </>
  );
}
