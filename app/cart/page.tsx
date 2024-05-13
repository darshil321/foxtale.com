import React from 'react';
import CartPage from 'components/cart/cart-page';
// import { getCart } from 'store/requests/cart.request';
const Page: React.FC = async () => {
  // const data = await getCart({ cartId: '10' });

  return <>{<CartPage />}</>;
};

export default Page;
