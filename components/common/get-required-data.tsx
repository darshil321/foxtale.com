'use client';
import { getMagicLinkMetaObjects } from '@/lib/shopify';
import { cartActions } from '@/store/actions/cart.action';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const GetRequiredData = () => {
  const cart = useSelector((state: any) => state.cart.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMetaObjects = async () => {
      // const metaObjects = await getMetaObjects();
      const metaObjects = await getMagicLinkMetaObjects();
      console.log('metaObjects', metaObjects);
      console.log('cart', cart);
      dispatch(cartActions.setMetaObject(metaObjects));
    };

    fetchMetaObjects();
  }, [cart, dispatch]);

  return null;
};

export default GetRequiredData;
