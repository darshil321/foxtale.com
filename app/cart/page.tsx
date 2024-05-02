import React from 'react';
import CartPage from 'components/cart/cart-page';
// import { getCart } from 'store/requests/cart.request';
const Page: React.FC = async () => {
  // const data = await getCart({ cartId: '10' });
  // console.log(data);

  return <>{<CartPage />}</>;
};

export default Page;
