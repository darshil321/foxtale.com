'use client';

import clsx from 'clsx';
import type { SortFilterItem } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ListItem, PathFilterItem } from '.';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setIsUserClicked, setSelectedCollection } from '@/store/slices/product-slice';
import { useAppSelector } from '@/store/hooks';
import { trackEvent } from 'utils/mixpanel';
import { fbEvent } from 'utils/facebook-pixel';

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const dispatch = useDispatch();
  const selectedCollection = useAppSelector((state) => state.products.selectedCollection);

  const handleClick = () => {
    trackEvent('Header Collection Clicked', {
      collectionName: item.title,
      BannerUrl: item?.image?.url
    });
    fbEvent('Header Collection Clicked', {
      collectionName: item.title,
      BannerUrl: item?.image?.url
    });

    dispatch(setSelectedCollection(item.handle?.toLowerCase()));
    dispatch(setIsUserClicked(true)); // Reset after action
  };
  const active = selectedCollection === item?.handle?.toLowerCase();

  return (
    <ul>
      <li className="mt-2 flex h-full w-full items-center justify-center gap-2 text-black">
        <div
          onClick={handleClick}
          className={`relative flex h-full cursor-pointer flex-col items-center justify-center gap-1 md:gap-2
      `}
        >
          <Image
            src={item?.image?.url || '/Images/defualt.png'}
            className=" flex min-h-[8px]  min-w-[80px] items-center justify-center  rounded-full md:min-h-[105px] md:min-w-[105px]"
            alt={(item?.title && item?.title + Math.random()) || 'Image'}
            width={70}
            loading="lazy"
            objectFit="cover"
            quality={100}
            height={70}
          />
          <button
            className={`line-clamp-1 text-ellipsis text-wrap text-center text-xs md:text-sm `}
          >
            {item.title}
          </button>
          <div
            className={`h-[2px] w-[78px] rounded-full ${active ? 'bg-black' : ''}  transition-colors duration-300 ease-in-out md:w-[138px]`}
          ></div>
        </div>
      </li>
    </ul>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get('sort') === item.slug;
  const q = searchParams.get('q');
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug })
    })
  );
  const DynamicTag = active ? 'p' : Link;

  return (
    <ul>
      <li className="mt-2 flex text-sm text-black " key={item.title}>
        <DynamicTag
          prefetch={!active ? false : undefined}
          href={href}
          className={clsx('w-full hover:underline hover:underline-offset-4', {
            'underline underline-offset-4': active
          })}
        >
          {item.title}
        </DynamicTag>
      </li>
    </ul>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />;
}
