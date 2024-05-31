// utils/mixpanel.ts
// import useFacebookPixel from '@/lib/hooks/use-fb-pixel';
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
  debug: true,
  loaded: () => {
    console.log('Mixpanel loaded!');
  }
});

// const { trackEvent } = useFacebookPixel('YOUR_PIXEL_ID');

export const trackEvent = (name: string, props?: Record<string, unknown>): void => {
  if (typeof window !== 'undefined') {
    mixpanel.track(name, props);
  }
};

export default mixpanel;
