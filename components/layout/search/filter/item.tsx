'use client';

import clsx from 'clsx';
import type { SortFilterItem } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ListItem, PathFilterItem } from '.';
import Image from 'next/image';

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? 'p' : Link;

  newParams.delete('q');

  return (
    <li
      className="mt-2 flex h-full w-full items-center justify-center gap-2 text-black  "
      key={item.title}
    >
      <div className="flex  flex-col items-center justify-center gap-2">
        <Image
          src={item?.image?.url || '/Images/defualt.png'}
          className=" flex min-h-[100px] min-w-[100px]  items-center justify-center rounded-full"
          alt={item?.title || 'Image'}
          width={100}
          height={100}
        />
        <DynamicTag
          href={createUrl(item.path, newParams)}
          className={clsx(
            'line-clamp-1 text-ellipsis text-wrap text-center text-sm underline-offset-4 hover:underline ',
            {
              'underline underline-offset-4': active
            }
          )}
        >
          {item.title}
        </DynamicTag>
      </div>
    </li>
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
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />;
}
