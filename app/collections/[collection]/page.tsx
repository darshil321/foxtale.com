import { getCollection, getCollectionProducts } from 'lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultSort, sorting } from 'lib/constants';
import { Suspense } from 'react';
import Loading from '../loading';

import CollectionProductsContainer from '@/components/layout/search/collection-products';

export const generateStaticParams = async () => {
  return [
    {
      collection: 'shop-1'
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
      handle: '399-store'
    },
    {
      handle: '499-store'
    }
  ];

  const collectionsView = [
    {
      section: 'Moisturisers',
      title: 'Moisturisers at 399/-'
    },
    {
      section: 'Sunscreens',
      title: 'Sunscreens at 499/-'
    },
    {
      section: 'Serums',
      title: 'Serums at 499/-'
    },
    {
      section: 'Masks',
      title: 'Masks at 499/-'
    }
  ];
  // Fetch products for all collections simultaneously
  const promises = collections.map(
    async (collection) =>
      await getCollectionProducts({ collection: collection.handle, sortKey, reverse })
  );

  const [products399 = [], products499 = []] = await Promise.all(promises);

  const productsByCollection = [...products399, ...products499].reduce(
    (acc: any, cur) => {
      if (cur.collections.includes('SP: Serums')) {
        acc[2].push(cur);
      } else if (cur.collections.includes('SP: Sunscreens')) {
        acc[1].push(cur);
      } else if (cur.collections.includes('SP: Masks')) {
        acc[3].push(cur);
      } else if (cur.collections.includes('SP: Moisturisers')) {
        acc[0].push(cur);
      }
      return acc;
    },
    [[], [], [], []]
  );
  console.log('productsByCollection', productsByCollection);
  // console.log('productsByCollection', productsByCollection);

  // const products = await appendReviewAndRating(productsByCollection);
  return (
    <>
      <div className="h-full w-full gap-4 space-y-6 ">
        {productsByCollection?.map((product: any, index: number) => (
          <Suspense fallback={<Loading />} key={index}>
            <CollectionProductsContainer
              key={index}
              index={index}
              collections={collectionsView}
              products={product}
            />
          </Suspense>
        ))}
      </div>
    </>
  );
}
