import { Cart } from '@/lib/shopify/types';

export const getUpdatedMerchandiseId = (prevCart: Cart, currentCart: Cart) => {
  const prevMerchandiseId = prevCart?.lines?.[0]?.merchandise?.id;
  const currentMerchandiseId = currentCart?.lines?.[0]?.merchandise?.id;
  const currentProductId = currentCart?.lines?.[0]?.merchandise?.product?.id;

  if (prevMerchandiseId !== currentMerchandiseId) {
    return currentMerchandiseId ? currentProductId : null;
  }

  return null;
};
