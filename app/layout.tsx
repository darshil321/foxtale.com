import Navbar from 'components/layout/navbar';
import { ensureStartsWith } from 'lib/utils';
import { ReactNode, Suspense } from 'react';
import './globals.css';
import WrapperContainer from 'components/layout/wrapper-container';
import Provider from '../store/store-provider';
import Banner from 'components/layout/navbar/banner';
import { Poppins } from 'next/font/google';
import InitialData from '@/components/initial-data';
import { ToastContainer } from 'react-toastify';
import { cookies } from 'next/headers';
// import GoogleAnalytics from '@/components/google-analytics/google-analytics';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

// import Script from 'next/script';
import { FacebookPixel } from '@/components/facebook-pixel';

const poppins = Poppins({
  subsets: ['latin'],
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
  const cartId = cookies().get('cartId')?.value;

  return (
    <html lang="en">
      <link rel="preconnect" href={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN} />{' '}
      <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN} />
      <link
        rel="icon"
        type="image/png"
        href="https://foxtale.in/cdn/shop/files/Favicon-01_1_1.png?v=1678945973&width=32"
      />
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />

        <GoogleTagManager gtmId="GTM-KP8TX5F4" />

        <Provider>
          <ToastContainer
            style={{
              width: '350px',
              position: 'fixed',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999
            }}
          />
          <FacebookPixel />
          <Banner />
          <WrapperContainer>
            <Navbar />
          </WrapperContainer>
          <Suspense fallback={null}>
            <InitialData cartId={cartId} />
          </Suspense>
          <main className={poppins.className}>{children}</main>
        </Provider>

        {/* <Script
          id="adz_rum"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
                const s = document.createElement("script");
                s.src = "https://rum.auditzy.com/IqMuiumz-foxtale-poc.vercel.app.js";
                document.head.appendChild(s);
              })()`
          }}
        /> */}
      </body>
    </html>
  );
}
