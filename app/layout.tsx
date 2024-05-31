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
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
});

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME, NEXT_PUBLIC_FB_PIXEL_ID } = process.env;
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
          <Banner />
          <WrapperContainer>
            <Navbar />
          </WrapperContainer>
          <Suspense fallback={null}>
            <InitialData cartId={cartId} />
          </Suspense>
          <main className={poppins.className}>{children}</main>
        </Provider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init',${NEXT_PUBLIC_FB_PIXEL_ID} );
                fbq('track', 'PageView');
              `
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <Script
          id="adz_rum"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
                const s = document.createElement("script");
                s.src = "https://rum.auditzy.com/IqMuiumz-foxtale-poc.vercel.app.js";
                document.head.appendChild(s);
              })()`
          }}
        />
      </body>
    </html>
  );
}
