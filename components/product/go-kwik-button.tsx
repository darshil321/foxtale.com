// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { gokwikConfig } from '../../lib/shopify/gokwik.config';
import { createCart, getCart } from '@/lib/shopify';
import { addItem, removeItem } from '../cart/actions';
import { useAppSelector } from '@/store/hooks';
import { trackEvent } from 'utils/mixpanel';
import { setCart } from '@/store/slices/cart-slice';
import { sendGAEvent } from '@next/third-parties/google';
import { fbEvent } from 'utils/facebook-pixel';
// import { getCartData } from '@/lib/helper/helper';

const integrationUrls = {
  local: 'http://localhost:8080/integration.js',
  dev: 'https://dev.pdp.gokwik.co/integration.js',
  hdev: 'https://dev.pdp.gokwik.co/integration.js',
  ndev: 'https://dev.pdp.gokwik.co/integration.js',
  qa: 'https://qa.pdp.gokwik.co/integration.js',
  qatwo: 'https://qatwo.pdp.gokwik.co/integration.js',
  sandbox: 'https://sandbox.pdp.gokwik.co/integration.js',
  production: 'https://pdp.gokwik.co/integration.js'
};

// const analyticsUrl = {
//   local: 'http://localhost:8080/integration.js',
//   dev: 'https://devhits.gokwik.co/api/v1/events',
//   hdev: 'https://devhits.gokwik.co/api/v1/events',
//   ndev: 'https://devhits.gokwik.co/api/v1/events',
//   qa: 'https://qa-hits.gokwik.co/api/v1/events',
//   qatwo: 'https://qa-hits.gokwik.co/api/v1/events',
//   sandbox: 'https://sandbox-hits.gokwik.co/api/v1/events',
//   production: 'https://hits.gokwik.co/api/v1/events',
//   'qa-rto': 'https://qa-hits.gokwik.co/api/v1/events',
//   qaone: 'https://qa-hits.gokwik.co/api/v1/events'
// };
export function GokwikButton(passedData) {
  const cartId = useAppSelector((state) => state.cart.cartId);
  // const carts = useAppSelector((state) => state.cart.cart);

  // const data = getCartData(carts);
  // const totalCartQuantity = data.totalQuantity;

  // const { currencyCode, totalAmount } = data;

  window.addEventListener('message', (e) => {
    if (e.data.type === 'modal_close_hydrogen') {
      getCart(cartId).then((data) => {
        const lineIds = data?.lines?.map((line) => {
          return line.id;
        });
        console.log('clearing cart', lineIds, cartId);

        removeItem(lineIds).then((data) => {
          setCart(data);
          console.log('cart cleared', data);
        });
      });
    }
  });
  const [loading, setLoading] = useState(false);
  const cartLoading = useAppSelector((state) => state.cart.loading);

  let buyNowRun = false;
  useEffect(() => {
    window.merchantInfo = {
      mid: gokwikConfig.mid,
      environment: gokwikConfig.env,
      type: 'merchantInfo',
      data: {}
    };

    const script = document.createElement('script');
    script.src = integrationUrls[window.merchantInfo.environment];
    document.body.appendChild(script);

    console.log('gokwik script loaded');
    script.onload = () => {
      if (window.gokwikSdk && typeof window.gokwikSdk.init === 'function') {
        window.gokwikSdk.init();
      } else {
        console.error('GoKwik SDK initialization failed: SDK object or init method is undefined.');
        // Handle the error condition gracefully, e.g., display a message to the user or fallback to alternative behavior.
      }

      window.gokwikSdk &&
        window.gokwikSdk.on('modal_closed', () => {
          !buyNowRun && localStorage.removeItem('shopifyCartId');
        });
    };
  }, [buyNowRun]);

  const triggerBuyNow = (passedData: { quantity: number; variantId: string; title: string }) => {
    setLoading(true);
    if (passedData.title === 'Buy Now') {
      createCart().then((data) => {
        addItem(passedData.variantId, data.id).then((data) => {
          setLoading(false);
          triggerGokwikCheckout(data);
        });
      });
    } else {
      getCart(cartId).then((data) => {
        console.log('cart after checkout', data);
        setLoading(false);
        triggerGokwikCheckout(data);
      });
    }
  };

  // const makeXhr = async (method, url, data, track) => {
  //   /* Foxtale had some custom hadnling related to "/cart/add.js" which was
  //   not allowing us to add product to cart hence this merchatn specific code is added */
  //   const gokwikXhttp = new XMLHttpRequest();
  //   gokwikXhttp.open(method, url, true);
  //   gokwikXhttp.setRequestHeader('Content-type', 'application/json');
  //   gokwikXhttp.onload = function () {
  //     const status = gokwikXhttp.status;
  //     const response = gokwikXhttp.response;
  //     track(status, response);
  //   };
  //   let requestBody = data ? JSON.stringify(data) : null;
  //   if (data?.['properties[_ftmx]']) {
  //     requestBody = data;
  //   }
  //   gokwikXhttp.send(requestBody);
  // };

  // const logEvent = (evtName, evtType) => {
  //   const url = analyticsUrl[window.merchantInfo.environment];
  //   const timestamp = Date.now();
  //   const userAgent = navigator.userAgent;
  //   const merchantId = window.merchantInfo.mid;
  //   const name = evtName;
  //   const eventType = evtType;
  //   const type = 'event';
  //   const adSource = getCookie('_shopify_sa_p');
  //   const sessionId = localStorage.getItem('gokwik-sessionID') || getCookie('gokwik-sessionID');
  //   const version = '1';
  //   const shopifySessionId = getCookie('_shopify_s') || null;
  //   const landing_page = getCookie('gk_landing_page') || '/';
  //   const orig_referrer = getCookie('gk_orig_referrer') || 'blank';
  //   const analyticsObj: {
  //     timestamp: number;
  //     userAgent: string;
  //     version: string;
  //     merchantId: string;
  //     name: string;
  //     sessionId?: string | null;
  //     type: string;
  //     adSource?: string;
  //     eventType: string;
  //     shopifySessionId: string;
  //     landing_page: string;
  //     orig_referrer: string;
  //   } = {
  //     timestamp,
  //     userAgent,
  //     version,
  //     merchantId,
  //     name,
  //     sessionId,
  //     type,
  //     adSource,
  //     eventType,
  //     ...(shopifySessionId && { shopifySessionId }),
  //     landing_page,
  //     orig_referrer
  //   };
  //   if (!sessionId) delete analyticsObj['sessionId'];
  //   if (!adSource) delete analyticsObj['adSource'];

  //   if (eventType === 'development') {
  //     delete analyticsObj.shopifySessionId;
  //     delete analyticsObj.sessionId;
  //   }

  //   makeXhr('POST', url, analyticsObj, (status, response) => {

  //     //added to pass param
  //     if (status !== 201) {
  //     }
  //   });
  // };

  const triggerGokwikCheckout = async (cart?) => {
    if (cart) {
      window.merchantInfo.cart = cart;
      buyNowRun = true;
      // logEvent('gk_buy_now_button_clicked', 'onGkClick');
    } else {
      const apiResponse = await getCart(cart.id);
      window.merchantInfo.cart = apiResponse.data ? apiResponse.data.cart : null;
      buyNowRun = false;
      // logEvent('gokwik-button-clicked', 'onGkClick');
    }

    window.gokwikSdk.initCheckout(window.merchantInfo);
  };
  const goKwikButtonLoad = loading || (cartLoading && passedData.title !== 'Buy Now');

  return (
    <>
      {!passedData.hideButton && (
        <button
          disabled={goKwikButtonLoad}
          aria-disabled={goKwikButtonLoad}
          className={`relative flex items-center justify-center border border-black  bg-black px-10 py-2 text-sm font-medium uppercase tracking-wide   text-white  hover:text-purple-400 md:flex-none md:px-16 md:text-sm ${goKwikButtonLoad ? 'cursor-not-allowed opacity-70' : ''}`}
          onClick={(event) => {
            event.preventDefault();

            sendGAEvent({
              event: 'Checkout Started!'
            });
            // trackEvent('Checkout Started!');
            trackEvent('Initiate checkout', {});
            fbEvent('Initiate checkout', {});
            passedData.buyNowButton ? triggerBuyNow(passedData) : triggerGokwikCheckout();
          }}
        >
          {passedData.buyNowButton ? passedData.title : 'Pay via UPI/COD'}
          {passedData.title !== 'Buy Now' && (
            <img
              className="ml-4"
              src="https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Group_163.svg?v=1684908604"
              alt="SVG Image"
            />
          )}

          {goKwikButtonLoad && (
            <div className="ml-2 h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white md:h-5 md:w-5"></div>
          )}
        </button>
      )}
    </>
  );
}
