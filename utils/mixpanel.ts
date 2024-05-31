// utils/mixpanel.ts

import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
  debug: true,
  loaded: () => {
    console.log('Mixpanel loaded!');
  }
});

export const trackEvent = (name: string, props?: Record<string, unknown>): void => {
  if (typeof window !== 'undefined') {
    mixpanel.track(name, props);
  }
};

export default mixpanel;
