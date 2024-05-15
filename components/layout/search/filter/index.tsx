import { SortFilterItem } from 'lib/constants';
import { Suspense } from 'react';
// import FilterItemDropdown from './dropdown';
import { FilterItem } from './item';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = {
  title?: string;
  handle?: string;
  path: string;
  image?: { url: string; alt: string };
};

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <div className=" flex h-max w-full max-w-2xl flex-row items-center justify-evenly gap-2 overflow-x-auto overflow-y-hidden border-b-2 border-gray-400 md:gap-10">
      {list && list.map((item: ListItem, i) => <FilterItem key={i} item={item} />)}
    </div>
  );
}

export default function FilterList({ list }: { list: ListItem[]; title?: string }) {
  return (
    <>
      <nav className=" sticky top-0">
        <ul className=" h-[125px] items-center   justify-center rounded-md bg-white transition-all   delay-100 md:flex  md:h-[170px] ">
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
