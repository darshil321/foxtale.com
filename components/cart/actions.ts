'use server';
import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(selectedVariantId: string | undefined, instantCartId?: string) {
  let cartId;
  if (!instantCartId) {
    cartId = cookies().get('cartId')?.value;
  } else {
    cartId = instantCartId;
  }

  let cart;

  // Get cart
  if (cartId) {
    cart = await getCart(cartId);
  }

  // Create cart
  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    cookies().set('cartId', cartId);
  }

  if (!selectedVariantId) {
    console.log('Missing product variant ID');
    return 'Missing product variant ID';
  }

  try {
    const data = await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
    return data;
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const data = await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
    return data;
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
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
