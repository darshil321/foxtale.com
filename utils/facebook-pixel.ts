export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
import { v4 as uuidv4 } from 'uuid';
export const pageview = () => {
  window.fbq('track', 'PageView');
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const fbEvent = (name: any, options = {}) => {
  window.fbq('track', name, options, { eventID: uuidv4() });
};
