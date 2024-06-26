import clsx from 'clsx';
import { Suspense } from 'react';
// import { getCollections } from 'lib/shopify';
import FilterList from './filter';

async function CollectionList() {
  // const collections = await getCollections();

  const collections = [
    {
      handle: 'moisturisers',
      title: 'Moisturisers',
      description: 'Shop hydrating moisturizers for all skin types and concerns.',
      seo: {
        description: 'Hydrating moisturizers for smooth and supple skin',
        title: 'Moisturizers - Shop Hydrating Moisturizers Online'
      },
      updatedAt: '2024-05-06T12:10:15Z',
      image: { url: '/Images/MOISTURISER.svg' },
      path: '/products/moisturizers'
    },
    {
      handle: 'Sunscreens',
      title: 'Sunscreens',
      description: 'Explore a variety of sunscreens to protect your skin from harmful UV rays.',
      seo: {
        description: 'Sunscreen protection for all skin types',
        title: 'Sunscreens - Shop Sun Protection Online'
      },
      updatedAt: '2024-05-06T12:10:15Z',
      image: { url: '/Images/SUNSCREEN.svg' },
      path: '/products/SUNSCREEN.svg'
    },
    {
      handle: 'serums',
      title: 'Serums',
      description: 'Find targeted serums to address various skincare needs and concerns.',
      seo: {
        description: 'Targeted serums for specific skincare needs',
        title: 'Serums - Shop Targeted Skincare Serums Online'
      },
      updatedAt: '2024-05-06T12:10:15Z',
      image: { url: '/Images/SERUM.svg' },
      path: '/products/serums'
    },
    {
      handle: 'masks',
      title: 'Masks',
      description: 'Discover a range of gentle cleansers for your daily skincare routine.',
      seo: {
        description: 'Gentle cleansers for your daily skincare routine',
        title: 'Cleansers - Shop Gentle Cleansers Online'
      },
      updatedAt: '2024-05-06T12:10:15Z',
      image: { url: '/Images/MASK.svg' },
      path: '/products/cleansers'
    }
  ];

  if (!collections) return null;

  return <FilterList list={collections as any} />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
const activeAndTitles = 'bg-neutral-800 ';
const items = 'bg-neutral-400 ';

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
