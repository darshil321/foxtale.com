/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useEffect, useState } from 'react';

function ScrollHandler({ children }) {
  const [setSelectedCollection] = useState(null);

  useEffect(() => {
    function handleScroll() {
      const collections = ['cleansers', 'Sunscreens', 'moisturizers', 'serums'];

      const offset = 100; // Adjust this value as needed

      collections.forEach((collection) => {
        const section = document.getElementById(collection.toLowerCase());
        if (section) {
          const top = section.getBoundingClientRect().top;
          if (top >= -offset && top <= window.innerHeight - offset) {
            setSelectedCollection(collection);
            window.history.replaceState(null, '', `#${collection}`);
          }
        }
      });
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render children
  return <>{children}</>;
}

export default ScrollHandler;
