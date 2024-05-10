'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem, removeItem, updateItemQuantity } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import type { Cart, CartItem } from 'lib/shopify/types';
import { useFormState, useFormStatus } from 'react-dom';
import { debounce } from 'lib/helper/helper';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setCart } from 'store/slices/cart-slice';

import { cartActions } from '@/store/actions/cart.action';
import { getMetaObjects } from '@/lib/shopify';
// import { Metaobject } from '@shopify/hydrogen-react/storefront-api-types';

function SubmitButton({
  type,
  onClick,
  pending
}: {
  type: 'plus' | 'minus';
  // eslint-disable-next-line no-unused-vars
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  pending: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      aria-disabled={pending}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'cursor-not-allowed': pending,
          'ml-auto': type === 'minus'
        }
      )}
    >
      {pending ? (
        <LoadingDots className="bg-black" />
      ) : type === 'plus' ? (
        <PlusIcon className="h-4 w-4" />
      ) : (
        <MinusIcon className="h-4 w-4" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type
}: {
  item: CartItem;
  type: 'plus' | 'minus';
  // eslint-disable-next-line no-unused-vars
  handleLocalQuantityChange?: (itemId: string, newQuantity: number) => void;
  localQuantity?: number;
}) {
  interface Field {
    [key: string]: string;
  }

  interface MetaObject {
    id: string;
    type: string;
    fields: Field;
  }
  const [metaObject, setMetaObject] = useState<MetaObject[]>();

  const cart = useAppSelector((state) => state.cart.cart);
  const cartProducts = cart?.lines?.map((line) => line.merchandise?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metaObjects = await getMetaObjects();
        const transformedMetaObjects = metaObjects?.map((metaObject) => {
          const fieldsObject: Record<string, string> = {};
          metaObject?.fields?.forEach((field) => {
            fieldsObject[field.key ?? ''] = field.value ?? '';
          });
          console.log('fieldsObject', fieldsObject);
          return { ...metaObject, fields: fieldsObject };
        });
        console.log('transformedMetaObjects', transformedMetaObjects);
        setMetaObject(transformedMetaObjects);
        console.log('metaObjec', metaObjects);
      } catch (error) {
        // Handle error
      }
    };
    fetchData();
    const coupen = findClosestCoupon(metaObject ?? [], cart);
    if (coupen) {
      console.log('coupen', coupen);
      // formActionFree(coupen.fields.free_bie);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [formActionFree] = useFormState(addItem, null);

  const [message, formAction] = useFormState(updateItemQuantity, null);
  const { pending } = useFormStatus();
  const dispatch = useAppDispatch();
  function findClosestCoupon(
    metaObjects: MetaObject[],
    updatedCart: Cart | null
  ): MetaObject | undefined {
    let closestObject;
    let minDifference = Infinity;

    metaObjects.forEach((obj) => {
      const buyXQuantity = parseInt(obj?.fields?.buy_x_quantity ?? '');
      const priceCap = parseInt(obj?.fields?.price_cap ?? '');
      console.log(
        'buyXQuantity',
        buyXQuantity,
        'priceCap',
        priceCap,
        updatedCart?.totalQuantity,
        updatedCart?.cost.totalAmount.amount
      );

      if (
        buyXQuantity <= Number(updatedCart?.totalQuantity) &&
        priceCap <= Number(updatedCart?.cost.totalAmount.amount)
      ) {
        const difference = Math.abs(priceCap - Number(updatedCart?.cost.totalAmount.amount));
        if (difference < minDifference) {
          minDifference = difference;
          closestObject = obj;
        }
      }
    });

    console.log('closestObject', closestObject);

    return closestObject;
  }

  function increaseItemQuantity({ cart, item }: { cart: any; item: CartItem }) {
    const updatedCart = JSON.parse(JSON.stringify(cart));
    updatedCart.totalQuantity++;

    const index = updatedCart.lines.findIndex(
      (line: any) => line.merchandise.id === item.merchandise.id
    );

    if (index !== -1) {
      type === 'plus' ? updatedCart.lines[index].quantity++ : updatedCart.lines[index].quantity--;

      updatedCart.lines[index].cost.totalAmount.amount =
        updatedCart.lines[index].cost.amountPerQuantity.amount * updatedCart.lines[index].quantity;
    }

    const totalCost = updatedCart.lines.reduce((acc: any, line: any) => {
      const lineTotalAmount = Number(line.cost.totalAmount.amount);
      return acc + lineTotalAmount;
    }, 0);
    const totalQuantity = updatedCart.lines.reduce((acc: any, line: CartItem) => {
      const lineQuantity =
        Number(line?.cost?.totalAmount?.amount) === 0 ? 0 : Number(line.quantity);
      return acc + lineQuantity;
    }, 0);

    updatedCart.cost.totalAmount.amount = totalCost.toFixed(2);
    updatedCart.totalQuantity = totalQuantity;
    const coupen = findClosestCoupon(metaObject ?? [], updatedCart);

    if (coupen) {
      if (!cartProducts?.includes(coupen.fields.free_bie ?? '')) {
        formActionFree(coupen.fields.free_bie);
      }
    } else {
      const freeLineId = cart?.lines?.find(
        (line: any) => Number(line?.cost?.totalAmount?.amount) === 0
      )?.id;

      if (freeLineId) {
        formActionRemove.bind(null, freeLineId);
      }
    }

    dispatch(setCart(updatedCart));

    debouncedUpdateItemQuantity(updatedCart?.lines[index]?.quantity);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateItemQuantity: any = useCallback(
    debounce((newQuantity: number) => {
      const payload = {
        lineId: item.id,
        variantId: item.merchandise.id,
        quantity: newQuantity
      };
      dispatch(cartActions.updateCart(payload));

      // formAction(payload);
    }, 1000),
    [item.id, item.merchandise.id, formAction]
  );

  const handleQuantityChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    increaseItemQuantity({ cart, item });
  };
  const [formActionRemove] = useFormState(removeItem, null);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SubmitButton
        type={type}
        onClick={(e) => {
          handleQuantityChange(e);
        }}
        pending={pending}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
