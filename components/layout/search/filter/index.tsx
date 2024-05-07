import { SortFilterItem } from 'lib/constants';
import { Suspense } from 'react';
// import FilterItemDropdown from './dropdown';
import { FilterItem } from './item';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title?: string; path: string; image?: { url: string; alt: string } };

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <div className="flex h-max w-full max-w-2xl flex-row items-center justify-evenly gap-2 overflow-x-auto overflow-y-hidden md:gap-10">
      {list && list.map((item: ListItem, i) => <FilterItem key={i} item={item} />)}
    </div>
  );
}

export default function FilterList({ list }: { list: ListItem[]; title?: string }) {
  return (
    <>
      <nav className="">
        <ul className=" h-[125px] items-center justify-center rounded-md  bg-white md:flex  md:h-[175px] ">
          <Suspense fallback={null}>
            <FilterItemList list={list} />
          </Suspense>
        </ul>
        {/* <ul className="md:hidden">
          <Suspense fallback={null}>
            <FilterItemDropdown list={list} />
          </Suspense>
        </ul> */}
      </nav>
    </>
  );
}
