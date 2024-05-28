import Navbar from 'components/layout/navbar';
import { ensureStartsWith } from 'lib/utils';
import { ReactNode, Suspense } from 'react';
import './globals.css';
import WrapperContainer from 'components/layout/wrapper-container';
import Provider from '../store/store-provider';
import Banner from 'components/layout/navbar/banner';
import { Poppins } from 'next/font/google';
import InitialData from '@/components/initial-data';

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
});

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // const promises = [
  //   getMetaObjects('gifts'),
  //   getMetaObjects('freebies'),
  //   getMetaObjects('magic_link')
  // ];

  // const results = await Promise.allSettled(promises);

  // const giftsCoupon = results[0]?.status === 'fulfilled' ? results[0].value : null;
  // const freebieCoupons = results[1]?.status === 'fulfilled' ? results[1].value : null;
  // const magicLinks = results[2]?.status === 'fulfilled' ? results[2].value : null;

  return (
    <html lang="en">
      <link rel="preconnect" href={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN} />{' '}
      <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN} />
      <body>
        <Provider>
          <Banner />
          <WrapperContainer>
            <Navbar />
          </WrapperContainer>
          <Suspense fallback={null}>
            <InitialData />
          </Suspense>
          <main className={poppins.className}>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
