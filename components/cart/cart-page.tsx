import { getCart } from 'lib/shopify';
import { cookies } from 'next/headers';
import AddToCart from './add-to-cart';

export default async function CartPage() {
  const cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <AddToCart cart={cart} />;
}
