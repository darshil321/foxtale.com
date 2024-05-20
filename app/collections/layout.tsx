import Footer from '@/components/layout/footer';
import HeroBannerSlider from '@/components/product/hero-banner-slider';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Collections = dynamic(() => import('@/components/layout/search/collections'));

export default async function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#E4E4E4]">
      <div className="w-full p-1.5 md:p-8">
        <Suspense fallback={<> Loading ...</>}>
          <HeroBannerSlider />
        </Suspense>
      </div>
      <div className=" flex max-w-screen-2xl flex-col gap-2 px-2 pb-2 text-black md:gap-8 md:px-8 md:pb-4 ">
        <div className=" sticky top-0 z-40 w-full flex-none rounded-md bg-white  shadow-md">
          <Collections />
        </div>
        <div className="h-full min-h-max w-full ">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
