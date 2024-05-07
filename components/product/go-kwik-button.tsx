// @ts-nocheck
'use client';
import { CartWithActions, useCart } from '@shopify/hydrogen-react';
import { useEffect } from 'react';
import { gokwikConfig } from '../../lib/shopify/gokwik.config';

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
  const updatedCart = useCart();
  console.log('updatedCart', updatedCart.id);

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
    // console.log('script', script);

    script.onload = () => {
      console.log('script1');
      if (window.gokwikSdk && typeof window.gokwikSdk.init === 'function') {
        console.log('script2', window.gokwikSdk);
        window.gokwikSdk.init();
        console.log('script3', window.gokwikSdk);
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

  const triggerBuyNow = (passedData: { quantity: number; variantId: string }) => {
    console.log('passedData', passedData);

    createBuyNowCart(passedData);
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
  //     console.log(response);

  //     //added to pass param
  //     if (status !== 201) {
  //     }
  //   });
  // };

  const addToCart = (cart: CartWithActions) => {
    const query = `
        mutation addItemToCart($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id}}}`;
    const variables = {
      cartId: cart.id,
      lines: {
        merchandiseId: cart?.lines[0]?.merchandise?.id,
        quantity: cart?.lines[0]?.quantity
      }
    };
    gokwikStoreFrontApi(query, variables);
  };
  const removeFromCart = (cart: CartWithActions) => {
    const lineIDsToRemove = [];
    console.log('lineIDsToRemove', lineIDsToRemove);

    const query = `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
     id
    }

  }
}`;
    const variables = {
      cartId: cart.id,
      lineIds: []
    };
    gokwikStoreFrontApi(query, variables);
  };
  console.log(addToCart, removeFromCart);

  const createBuyNowCart = (passedData) => {
    const q = `mutation AddToCart {
      cartCreate(
        input: {lines: {merchandiseId: "gid://shopify/ProductVariant/44755858620663"}}
      ) {
        cart {
            lines(first: 100) {
            edges {
              node {
                id
                discountAllocations{
                   ... on CartAutomaticDiscountAllocation {
                    title
                    discountedAmount {
                      currencyCode
                      amount
                    }
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      createdAt
                      description
                      id
                      productType
                      title
                      updatedAt
                      vendor
                    }
                    image {
                      height
                      id
                      url
                      width
                    }
                    price{
                        amount
                    }
                    unitPrice {
                      amount
                      currencyCode
                    }
                  }
                }
                quantity
              }
            }
            }
          id
        }
      }
    }`;
    const query = `
    mutation createCart($cartInput: CartInput) {
      cartCreate(input: {lines: {merchandiseId: "gid://shopify/ProductVariant/46638233420059"}}) {
        cart {
          id
          discountCodes {
            applicable
            code
          }
          attributes {
            key
            value
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          totalQuantity
          note
          lines(first: 100) {
            edges {
              node {
                id
                merchandise {
                  id
                  title
                  product {
                    createdAt
                    description
                    id
                    productType
                    title
                    updatedAt
                    vendor
                  }
                  image {
                    height
                    id
                    url
                    width
                  }
                  price
                  unitPrice {
                    amount
                    currencyCode
                  }
                }
                quantity
              }
            }
          }
        }
      }
    }
        `;
    console.log(query);

    //   const query = `mutation AddToCart {
    //   cartCreate(
    //     input: {lines: {merchandiseId: "gid://shopify/ProductVariant/46638233420059"}}
    //   ) {
    //     cart {
    //       id
    //     }
    //   }
    // }`;

    const variables = {
      cartInput: {
        lines: [
          {
            quantity: passedData.quantity,
            merchandiseId: passedData.variantId
          }
        ]
      }
    };
    console.log('@@@@', variables, passedData);

    gokwikStoreFrontApi(q, variables, passedData).then((res) => {
      console.log('qqq', res.data);

      triggerGokwikCheckout(res.data.cartCreate.cart);
    });
  };
  const getCart = async (id) => {
    console.log(id);

    const query = `
        query getCart($cartId: ID!){
    cart(id: $cartId){
      id


      discountCodes {
        applicable
        code
      }

      attributes {
        key
        value
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      totalQuantity
      note
      lines(first: 100) {
        edges {
          node {
            id
						
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  createdAt
                  description
                  id
                  productType
                  title
                  updatedAt
                  vendor
                }
                image {
                  height
                  id
                  url
                  width
                }
                price{
                  amount
                }
                unitPrice {
                  amount
                  currencyCode
                }
              }
            }
            quantity
          }
        }
      }
    }
  }`;
    const variable = {
      cartId: 'gid://shopify/Cart/Z2NwLXVzLWVhc3QxOjAxSFdZVlNSMjJRMkRNMTI0S0tNWDBTRjJQ'
    };
    return await gokwikStoreFrontApi(query, variable);
  };

  const gokwikStoreFrontApi = async (query: string, variables: any) => {
    return await fetch(gokwikConfig.shopifyGraphQlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': gokwikConfig.storefrontAccessToken
      },
      body: JSON.stringify({ query, variables })
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const triggerGokwikCheckout = async (cart?) => {
    if (cart) {
      window.merchantInfo.cart = cart;
      buyNowRun = true;
      // logEvent('gk_buy_now_button_clicked', 'onGkClick');
    } else {
      console.log('updatedCart', updatedCart);
      const apiResponse = await getCart(updatedCart.id);
      window.merchantInfo.cart = apiResponse.data ? apiResponse.data.cart : null;
      buyNowRun = false;
      // logEvent('gokwik-button-clicked', 'onGkClick');
    }
    console.log('window.merchantInfo', window.merchantInfo);

    window.gokwikSdk.initCheckout(window.merchantInfo);
  };
  return (
    <>
      {!passedData.hideButton && (
        <button
          className={
            'relative flex flex-1 items-center justify-center border border-black  bg-black px-6 py-2 text-sm font-normal uppercase tracking-wide  text-white  hover:text-purple-400 md:flex-none md:px-8 md:text-base md:font-semibold'
          }
          onClick={(event) => {
            event.preventDefault();
            passedData.buyNowButton ? triggerBuyNow(passedData) : triggerGokwikCheckout();
          }}
        >
          {passedData.buyNowButton ? 'Buy Now' : 'Pay via UPI/COD'}
        </button>
      )}
    </>
  );
}
