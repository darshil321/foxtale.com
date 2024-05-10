import Collections from 'components/layout/search/collections';
import HeroBannerSlider from 'components/product/hero-banner-slider';
// import FilterList from 'components/layout/search/filter';
// import { sorting } from 'lib/constants';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#E4E4E4]">
      <div className="w-full p-1.5 md:p-8">
        <HeroBannerSlider />
      </div>
      <div className=" flex max-w-screen-2xl flex-col gap-8 px-2 pb-2 text-black md:px-8 md:pb-4 ">
        <div className=" sticky top-0 z-50 w-full flex-none rounded-md bg-white  shadow-md">
          <Collections />
        </div>
        <div className="h-full min-h-max w-full ">{children}</div>
        {/* <div className="order-none flex-none md:order-last">
          <FilterList list={sorting} title="Sort by" />
        </div> */}
      </div>
    </div>
  );
}
