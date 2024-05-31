import ReactGA from 'react-ga4';

const initializeGA = () => {
  // Replace with your Measurement ID
  // It ideally comes from an environment variable
  ReactGA.initialize(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!);
  // Don't forget to remove the console.log() statements
  // when you are done
  console.log('GA INITIALIZED');
};

const trackGAEvent = (category: any, action: any, label: any) => {
  console.log('GA event:', category, ':', action, ':', label);

  // Send GA4 Event
  ReactGA.event({
    category: category,
    action: action,
    label: label
  });
};

export default initializeGA;
export { initializeGA, trackGAEvent };
