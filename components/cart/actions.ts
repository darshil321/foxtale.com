'use server';
import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function createCartIfNotExists() {
  let cartId = cookies().get('cartId')?.value || null;
  let cart;

  console.log('cartId', cartId);
  if (!cartId) {
    cart = await createCart();
    cartId = cart.id;
    console.log('p', cartId);

    cookies().set('cartId', cartId);
  }
}

export async function addItem(selectedVariantId: string, cartID?: string) {
  let cartId = !cartID ? cookies().get('cartId')?.value : cartID;
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
export async function addItems(items: { quantity: number; merchandiseId: string }[]) {
  const cartId = cookies().get('cartId')?.value ?? '';
  console.log('adding', cartId);
  console.log('addingitem', items);

  try {
    const cartData = await getCart(cartId);
    console.log('cartData.id', cartData);

    const lineIds =
      cartData?.lines?.map((line) => {
        return line.id;
      }) || [];
    console.log('lineIds', lineIds);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await removeItem(lineIds);

    const createdCart = await createCart();

    const data = await addToCart(createdCart.id, items);
    // console.log('data', data);

    revalidateTag(TAGS.cart);
    return data;
  } catch (e) {
    console.log('e', e);
    return 'Error adding item to cart';
  }
  // Your function implementation here
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
