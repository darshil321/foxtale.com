import { getCollection, getCollectionProducts } from 'lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CollectionProductsContainer from '@/components/layout/search/collection-products';

export const generateStaticParams = async () => {
  return [
    {
      collection: '99-store'
    }
  ];
};

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  console.log('params', params);

  const collection = await getCollection('399-store');
  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function CategoryPage({}: { params?: string; searchParams?: string }) {
  const collectionsView = [
    {
      section: 'Moisturisers',
      title: 'Moisturisers at 399/-',
      Description: 'Protected skin barrier & a boost of hydration'
    },
    {
      section: 'Sunscreens',
      title: 'Sunscreens at 499/-',
      Description: 'Ultimate protection from UVA & UVB rays'
    },
    {
      section: 'Serums',
      title: 'Serums at 499/-',
      Description: 'Targeted solutions for all skin concerns'
    },
    {
      section: 'Masks',
      title: 'Masks at 499/-',
      Description: ''
    }
  ];

  const collections = [
    {
      handle: 'sp-moisturisers'
    },
    {
      handle: 'sp-sunscreens'
    },
    {
      handle: 'sp-serums'
    },
    {
      handle: 'sp-masks'
    }
  ];

  // Fetch products for all collections simultaneously
  const promises = collections.map(async (collection) => {
    const res = (await getCollectionProducts({
      collection: collection.handle
    })) as any;
    return res;
  });

  const productsByCollection = await Promise.all(promises);
  console.log('productsByCollection', productsByCollection);
  return (
    <>
      <div className="h-full w-full gap-4 space-y-6 ">
        {productsByCollection?.map((product: any, index: number) => (
          <CollectionProductsContainer
            key={index}
            index={index}
            collections={collectionsView}
            products={product}
          />
        ))}
      </div>
    </>
  );
}
