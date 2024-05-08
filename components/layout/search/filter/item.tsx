'use client';

import clsx from 'clsx';
import type { SortFilterItem } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ListItem, PathFilterItem } from '.';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? 'p' : Link;
  const linkRef = useRef<any>(null);

  newParams.delete('q');

  useEffect(() => {
    if (active) {
      // Scroll to the section when active
      const handle = item?.handle?.toLowerCase();
      const section = document.getElementById(handle as string);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return (
    <li
      className="mt-2 flex h-full w-full items-center justify-center gap-2 text-black  "
      key={item.title}
    >
      <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
        <Image
          src={item?.image?.url || '/Images/defualt.png'}
          className=" flex min-h-[80px]  min-w-[80px] items-center justify-center  rounded-full md:min-h-[100px] md:min-w-[100px]"
          alt={item?.title || 'Image'}
          width={100}
          height={100}
        />
        <DynamicTag
          ref={linkRef}
          href={createUrl(item.path, newParams)}
          className={clsx(
            'line-clamp-1 text-ellipsis text-wrap text-center text-xs underline-offset-4 hover:underline md:text-sm ',
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
