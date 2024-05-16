// @ts-nocheck
'use client';
import { useEffect } from 'react';
import { gokwikConfig } from '../../lib/shopify/gokwik.config';
import { createCart, getCart } from '@/lib/shopify';
import { addItem, addItems } from '../cart/actions';
import { useAppSelector } from '@/store/hooks';

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
  // const cartId = useAppSelector((state) => state.cart.cart?.id);
  const cart = useAppSelector((state) => state.cart.cart);

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
    if (passedData.title === 'Buy Now') {
      createCart().then((data) => {
        addItem(passedData.variantId, data.id).then((data) => {
          triggerGokwikCheckout(data);
        });
      });
    } else {
      const items = cart?.lines.map((item) => {
        return {
          merchandiseId: item.merchandise.id,
          quantity: item.quantity
        };
      });
      addItems(items).then((data) => {
        console.log('dataadd', data);

        triggerGokwikCheckout(data);
      });

      // getCart(cartId).then((data) => {
      //   triggerGokwikCheckout(data);
      // });
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
    console.log('cartss', cart);

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
  const loading = useAppSelector((state) => state.cart.loading);

  return (
    <>
      {!passedData.hideButton && (
        <button
          disabled={loading}
          aria-disabled={loading}
          className={`relative flex items-center justify-center border border-black  bg-black px-6 py-2 text-sm font-normal uppercase tracking-wide  text-white  hover:text-purple-400 md:flex-none md:px-12 md:text-sm ${loading ? 'cursor' : ''}`}
          onClick={(event) => {
            event.preventDefault();
            passedData.buyNowButton ? triggerBuyNow(passedData) : triggerGokwikCheckout();
          }}
        >
          {passedData.buyNowButton ? passedData.title : 'Pay via UPI/COD'}
          {loading && (
            <div className="ml-2 h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white md:h-5 md:w-5"></div>
          )}
        </button>
      )}
    </>
  );
}
