import React from 'react';
import AddToCart from 'components/cart/add-to-cart';
import { getCart } from 'store/requests/cart.request';
const Page: React.FC = async () => {
  console.log('eeeeeee');

  const data = await getCart({ first: 10 });
  console.log(data);

  return <>{<AddToCart />}</>;
};

export default Page;
