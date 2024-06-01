// const PIXEL_ID =
//   document.currentScript &&
//   document.currentScript.getAttribute(process.env.NEXT_PUBLIC_FB_PIXEL_ID);

// function initializeFacebookPixel(f, b, e, v, n, t, s) {
//   if (f.fbq) return;
//   n = f.fbq = function () {
//     n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
//   };
//   if (!f._fbq) f._fbq = n;
//   n.push = n;
//   n.loaded = !0;
//   n.version = '2.0';
//   n.queue = [];
//   t = b.createElement(e);
//   t.async = !0;
//   t.src = v;
//   s = b.getElementsByTagName(e)[0];
//   s.parentNode.insertBefore(t, s);
// }

// initializeFacebookPixel(
//   window,
//   document,
//   'script',
//   'https://connect.facebook.net/en_US/fbevents.js'
// );

function initializeFacebookPixel() {
  if (window.fbq) return; // If fbq function already defined, exit function

  window.fbq = function () {
    window.fbq.callMethod
      ? window.fbq.callMethod.apply(window.fbq, arguments)
      : window.fbq.queue.push(arguments);
  };

  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = '2.0';
  window.fbq.queue = [];

  const fbPixelScript = document.createElement('script');
  fbPixelScript.async = true;
  fbPixelScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(fbPixelScript);

  window.fbq('init', '751018776434062');
  window.fbq('track', 'PageView');
}

// Call the initialize function
initializeFacebookPixel();

// window.fbq('init', PIXEL_ID);
