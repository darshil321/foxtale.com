import { getCollection, getCollectionProducts } from 'lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

export default async function CategoryPage({}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
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
  console.log('plppppp');

  // Fetch products for all collections simultaneously
  const promises = collections.map(
    async (collection) => await getCollectionProducts({ collection: collection.handle })
  );

  const productsByCollection = await Promise.all(promises);
  console.log('productsByCollection', productsByCollection, productsByCollection?.length);

  return (
    <>
      <div className="h-full w-full gap-4 space-y-6 ">
        {productsByCollection?.map((products, index) => (
          <CollectionProductsContainer
            key={index}
            index={index}
            collections={collections}
            products={products}
          />
        ))}
      </div>
    </>
  );
}
