'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMetaObjects, getProducts } from '@/lib/shopify';
import { setFreebieCoupons, setGiftCoupons, setMagicLinkCoupons } from '@/store/slices/cart-slice';
import { setProducts } from '@/store/slices/product-slice';

const InitialData = () => {
  const dispatch = useDispatch();
  const [hasDataBeenFetched, setHasDataBeenFetched] = useState(false);

  const getMetaData = async () => {
    const results = await Promise.allSettled([
      getMetaObjects('gifts'),
      getMetaObjects('freebies'),
      getMetaObjects('magic_link')
    ]);

    const giftsCoupon = results[0].status === 'fulfilled' ? results[0].value : null;
    const freebieCoupons = results[1].status === 'fulfilled' ? results[1].value : null;
    const magicLinks = results[2].status === 'fulfilled' ? results[2].value : null;

    if (freebieCoupons) dispatch(setFreebieCoupons(freebieCoupons));
    if (giftsCoupon) dispatch(setGiftCoupons(giftsCoupon));
    if (freebieCoupons) dispatch(setFreebieCoupons(freebieCoupons));
    if (magicLinks) dispatch(setMagicLinkCoupons(magicLinks));
  };

  // Function to fetch product data
  const getProductsData = async () => {
    const products = await getProducts({});
    if (products) dispatch(setProducts(products));
  };

  const fetchDataOnInteraction = () => {
    if (!hasDataBeenFetched) {
      getMetaData();
      getProductsData();
      setHasDataBeenFetched(true);
    }

    window.removeEventListener('mousemove', fetchDataOnInteraction);
    // window.removeEventListener('scroll', fetchDataOnInteraction);
  };

  useEffect(() => {
    window.addEventListener('mousemove', fetchDataOnInteraction, { once: true });
    // window.addEventListener('scroll', fetchDataOnInteraction, { once: true });

    return () => {
      window.removeEventListener('mousemove', fetchDataOnInteraction);
      // window.removeEventListener('scroll', fetchDataOnInteraction);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default InitialData;
