'use server';
import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(prevState: any, selectedVariantId: string | undefined) {
  let cartId = cookies().get('cartId')?.value;
  let cart;
  console.log('cartIddh', cartId, selectedVariantId);

  if (cartId) {
    cart = await getCart(cartId);
  }
  console.log('cartIdd', cartId);

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    cookies().set('cartId', cartId);
  }
  // console.log('cartIdd', cartId);

  if (!selectedVariantId) {
    return 'Missing product variant ID';
  }

  try {
    const data = await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);
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
  console.log('cartIdd', cartId);

  try {
    console.log('removing');

    const data = await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
    return data;
    console.log('cartIdd', cartId);
  } catch (e) {
    return 'Error removing item from cart';
  }
  console.log('cartIdd', cartId);
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    variantId: string;
    quantity: number;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, variantId, quantity } = payload;
  console.log('updating', payload);

  try {
    if (quantity === 0) {
      const data = await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);
      return data;
    }

    const data = await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity
      }
    ]);

    revalidateTag(TAGS.cart);
    return data;
  } catch (e) {
    return 'Error updating item quantity';
  }
}
