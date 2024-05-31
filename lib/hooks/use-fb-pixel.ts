// lib/useFacebookPixel.js
import { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';

const useFacebookPixel = (pixelId) => {
  useEffect(() => {
    ReactPixel.init(pixelId);
    ReactPixel.pageView(); // For tracking page views
  }, [pixelId]);

  const trackEvent = (event, data) => {
    ReactPixel.track(event, data);
  };

  return { trackEvent };
};

export default useFacebookPixel;
