// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { gokwikConfig } from '../../lib/shopify/gokwik.config';
import { getCart } from '@/lib/shopify';
import { removeItem } from '../cart/actions';
import { useAppSelector } from '@/store/hooks';
import { setCart } from '@/store/slices/cart-slice';
import { createCart } from '@/store/requests/cart.request';
import { getCookieValue, getSource } from '@/lib/helper/helper';
import { trackEvent } from 'utils/mixpanel';

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
  const carts = useAppSelector((state) => state.cart.cart);

  // const data = getCartData(carts);
  // const totalCartQuantity = data.totalQuantity;

  // const { totalAmount } = data;

  const mixpanelDefaultCookieObj = getCookieValue(
    'mp_' + process.env.NEXT_PUBLIC_MIXPANEL_TOKEN + '_mixpanel'
  );
  const distinct_id = JSON.parse(mixpanelDefaultCookieObj)?.distinct_id;

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
      }

      window.gokwikSdk &&
        window.gokwikSdk.on('modal_closed', () => {
          !buyNowRun && localStorage.removeItem('shopifyCartId');
        });
    };
  }, [buyNowRun]);

  const triggerBuyNow = (passedData: { quantity: number; variantId: string; title: string }) => {
    setLoading(true);
    if (passedData.title === 'BUY NOW') {
      createCart({
        lines: [{ quantity: 1, merchandiseId: passedData.variantId }],
        attributes: [
          {
            key: 'distinct_id',
            value: distinct_id
          }
        ]
      }).then((data) => {
        setLoading(false);
        triggerGokwikCheckout(data.body.data.cartCreate.cart);
      });
    } else {
      const payload = carts.lines.map((cart) => ({
        quantity: cart.quantity,
        merchandiseId: cart.merchandise.id
      }));

      createCart({
        lines: payload,
        attributes: [
          {
            key: 'distinct_id',
            value: distinct_id
          }
        ]
      }).then((data) => {
        console.log('dataaaa', data);

        setLoading(false);
        triggerGokwikCheckout(data.body.data.cartCreate.cart);
      });
    }
  };

  const triggerGokwikCheckout = async (cart?) => {
    if (cart) {
      console.log('4444444', 4444444);
      window.merchantInfo.cart = cart;
      buyNowRun = true;
      // logEvent('gk_buy_now_button_clicked', 'onGkClick');
    } else {
      console.log('5555555', 5555555);
      const apiResponse = await getCart(cart.id);
      window.merchantInfo.cart = apiResponse.data ? apiResponse.data.cart : null;
      buyNowRun = false;
      // logEvent('gokwik-button-clicked', 'onGkClick');
    }

    window.gokwikSdk.initCheckout(window.merchantInfo);
  };

  //   const data = carts.lines.map((cart) => {
  //     const parts = cart.merchandise.id.split('/');
  //     const variantId = parts[parts.length - 1];
  //     const parts2 = cart.merchandise.product.id.split('/');
  //     const productId = parts2[parts2.length - 1];
  //     return {
  //       id: productId,
  //       quantity: cart.quantity,
  //       name: cart.merchandise.product.title,
  //       price: cart.merchandise.product.priceRange.minVariantPrice.amount,
  //       currency: cart.merchandise.product.priceRange.minVariantPrice.currencyCode,
  //       variant: variantId
  //     };
  //   });
  //   return data;
  // };

  // const getContentIds = () => {
  //   const data = carts.lines.map((cart) => {
  //     const parts2 = cart.merchandise.product.id.split('/');
  //     const productId = parts2[parts2.length - 1];
  //     return productId;
  //   });
  //   return data;
  // };
  // const goKwikButtonLoad = loading || (cartLoading && passedData.title !== 'BUY NOW');
  const goKwikButtonLoad = loading;

  const onCheckout = (event) => {
    event.preventDefault();

    trackEvent(
      passedData.title === 'BUY NOW' ? 'Clicked Dynamic Checkout Button' : 'Started Checkout',
      {
        'api-url-for-data': window.location.href,
        from: passedData.title === 'BUY NOW' ? 'from-pdp' : 'from-mini-cart-drawer',
        source: getSource(window.location.href)
      }
    );

    passedData.buyNowButton ? triggerBuyNow(passedData) : triggerGokwikCheckout();
  };

  return (
    <>
      {!passedData.hideButton && (
        <button
          disabled={goKwikButtonLoad}
          aria-disabled={goKwikButtonLoad}
          className={`relative flex items-center justify-center border border-black  bg-black px-10 py-2 text-sm font-medium  tracking-wide   text-white  hover:text-purple-400 md:flex-none md:px-16 md:text-sm ${goKwikButtonLoad ? 'cursor-not-allowed opacity-70' : ''}`}
          onClick={(event) => {
            onCheckout(event);
          }}
        >
          {passedData.buyNowButton ? passedData.title : 'Pay via UPI/COD'}
          {passedData.title !== 'BUY NOW' && (
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
