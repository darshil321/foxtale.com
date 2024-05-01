import Collections from 'components/layout/search/collections';
import HeroBannerSlider from 'components/product/hero-banner-slider';
// import FilterList from 'components/layout/search/filter';
// import { sorting } from 'lib/constants';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#E4E4E4]">
      <div className="w-full p-4 md:p-8">
        <HeroBannerSlider />
      </div>
      <div className=" flex max-w-screen-2xl flex-col gap-8 px-8 pb-4 text-black ">
        <div className=" w-full flex-none ">
          <Collections />
        </div>
        <div className="h-full min-h-screen w-full rounded-md bg-white px-4 md:order-none ">
          {children}
        </div>
        {/* <div className="order-none flex-none md:order-last">
          <FilterList list={sorting} title="Sort by" />
        </div> */}
      </div>
    </div>
  );
}
