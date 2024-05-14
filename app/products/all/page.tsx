import { getCollectionProducts } from 'lib/shopify';
// import { Metadata } from 'next';
// import { notFound } from 'next/navigation';
// import { defaultSort, sorting } from 'lib/constants';
import CollectionProductsContainer from '@/components/layout/search/collection-products';

// export const fetchCache = 'force-cache';

// export const generateStaticParams = async () => {
//   const collections = await getCollections();

//   return collections?.map((collection: any) => ({
//     collection: collection?.handle === '' ? 'all' : collection?.handle
//   }));
// };

async function getCollections() {
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
  const promises = collections.map((collection: any) => {
    const { handle } = collection;
    return getCollectionProducts({ collection: handle });
  });

  const productsByCollection = await Promise.all(promises);
  console.log('productsByCollection>>>>', productsByCollection);

  return productsByCollection;
}

// export async function generateMetadata({
//   params
// }: {
//   params: { collection: string };
// }): Promise<Metadata> {
//   const collection = await getCollection(params.collection);
//   if (!collection) return notFound();

//   return {
//     title: collection.seo?.title || collection.title,
//     description:
//       collection.seo?.description || collection.description || `${collection.title} products`
//   };
// }

export default async function Page({}: {
  // searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // const { sort } = searchParams as { [key: string]: string };
  // const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const productsByCollection = await getCollections();
  // console.log('collection>>>>', collections);

  // Fetch products for all collections simultaneously

  // console.log('PRODUCTS>>>>', productsByCollection);
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
