import InitialData from '@/components/initial-data';
import { getCollections, getMetaObjects } from '@/lib/shopify';
import Collections from 'components/layout/search/collections';
import HeroBannerSlider from 'components/product/hero-banner-slider';

export default async function SearchLayout({ children }: { children: React.ReactNode }) {
  const promises = [
    getMetaObjects('gifts'),
    getMetaObjects('freebies'),
    getMetaObjects('magic_link'),
    getCollections()
  ];

  const results = await Promise.allSettled(promises);

  const giftsCoupon = results[0]?.status === 'fulfilled' ? results[0].value : null;
  const freebieCoupons = results[1]?.status === 'fulfilled' ? results[1].value : null;
  const magicLinks = results[2]?.status === 'fulfilled' ? results[2].value : null;
  const collections = results[3]?.status === 'fulfilled' ? results[3].value : null;

  return (
    <div className="bg-[#E4E4E4]">
      <InitialData
        giftsCoupon={giftsCoupon}
        freebieCoupons={freebieCoupons}
        magicLinks={magicLinks}
        collections={collections}
      />
      <div className="w-full p-1.5 md:p-8">
        <HeroBannerSlider />
      </div>
      <div className=" flex max-w-screen-2xl flex-col gap-2 px-2 pb-2 text-black md:gap-8 md:px-8 md:pb-4 ">
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
