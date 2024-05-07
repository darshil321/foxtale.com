'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { updateItemQuantity } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import type { CartItem } from 'lib/shopify/types';
import { useFormState, useFormStatus } from 'react-dom';
import { debounce } from 'lib/helper/helper';
import { useAppDispatch } from 'store/hooks';
import { updateCartItemQuantity } from 'store/slices/cart-slice';

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
  const [quantity, setQuantity] = useState(item.quantity);
  const [message, formAction] = useFormState(updateItemQuantity, null);
  const { pending } = useFormStatus();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateItemQuantity = useCallback(
    debounce((newQuantity: number) => {
      const payload = {
        lineId: item.id,
        variantId: item.merchandise.id,
        quantity: newQuantity
      };
      formAction(payload);
    }, 1000),
    [item.id, item.merchandise.id, formAction]
  );

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const adjustment = type === 'plus' ? 1 : -1;
      const newQuantity = quantity + adjustment;
      const clampedQuantity = Math.max(newQuantity, 1);

      // handleLocalQuantityChange && handleLocalQuantityChange(item.id, clampedQuantity);
      dispatch(updateCartItemQuantity({ itemId: item.id, newQuantity }));
      setQuantity(clampedQuantity);
      debouncedUpdateItemQuantity();
    },
    [type, quantity, dispatch, debouncedUpdateItemQuantity, item.id]
  );

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SubmitButton type={type} onClick={handleQuantityChange} pending={pending} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
