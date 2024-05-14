'use client';
import { getMagicLinkMetaObjects } from '@/lib/shopify';
import { cartActions } from '@/store/actions/cart.action';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const GetRequiredData = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMetaObjects = async () => {
      // const metaObjects = await getMetaObjects();
      const metaObjects = await getMagicLinkMetaObjects();

      dispatch(cartActions.setMetaObject(metaObjects));
    };

    fetchMetaObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default GetRequiredData;
