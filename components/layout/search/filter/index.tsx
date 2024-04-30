import { SortFilterItem } from 'lib/constants';
import { Suspense } from 'react';
import FilterItemDropdown from './dropdown';
import { FilterItem } from './item';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title?: string; path: string; image?: { url: string; alt: string } };

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <div className="flex h-full w-full max-w-2xl flex-row items-center justify-evenly gap-4 overflow-x-auto ">
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </div>
  );
}

export default function FilterList({ list }: { list: ListItem[]; title?: string }) {
  console.log('list22', list);

  return (
    <>
      <nav className="">
        <ul className="hidden h-[175px] items-center justify-center  rounded-md bg-white  md:flex ">
          <Suspense fallback={null}>
            <FilterItemList list={list} />
          </Suspense>
        </ul>
        <ul className="md:hidden">
          <Suspense fallback={null}>
            <FilterItemDropdown list={list} />
          </Suspense>
        </ul>
      </nav>
    </>
  );
}
