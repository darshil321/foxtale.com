'use server';
import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(selectedVariantId: string) {
  let cartId = cookies().get('cartId')?.value || null;
  let cart;
  console.log('selectedVariantId', selectedVariantId);

  if (!selectedVariantId) {
    console.log('Missing product variant ID');
    return null;
  }
  if (cartId) cart = await getCart(cartId);

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    cookies().set('cartId', cartId);
  }

  try {
    const data = await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);

    revalidateTag(TAGS.cart);
    return data;
  } catch (e) {
    console.log('error adding cart', e);
    return null;
  }
}

export async function removeItem(lineIds: string[]) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const data = await removeFromCart(cartId, lineIds);
    revalidateTag(TAGS.cart);
    return data;
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  payload: {
    id: string;
    merchandiseId: string;
    quantity: number;
  }[]
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const data = await updateCart(cartId, payload);

    revalidateTag(TAGS.cart);
    return data;
  } catch (e) {
    console.log('Error updating item quantity', e);
    return 'Error updating item quantity';
  }
}
