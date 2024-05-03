import React, { useState, useEffect } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { updateItemQuantity } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import type { CartItem } from 'lib/shopify/types';
import { useFormState, useFormStatus } from 'react-dom';

// Debouncing function
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SubmitButton({ type, onClick }: { type: 'plus' | 'minus'; onClick: () => void }) {
  const { pending } = useFormStatus();

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
        <LoadingDots className="bg-black " />
      ) : type === 'plus' ? (
        <PlusIcon className="h-4 w-4 " />
      ) : (
        <MinusIcon className="h-4 w-4 " />
      )}
    </button>
  );
}

export function EditItemQuantityButton({ item, type }: { item: CartItem; type: 'plus' | 'minus' }) {
  const [message, formAction] = useFormState(updateItemQuantity, null);
  const [accumulatedQuantity, setAccumulatedQuantity] = useState(item.quantity);
  const debouncedQuantity = useDebounce(accumulatedQuantity, 1000); // 1 second delay

  useEffect(() => {
    // Ensure the debounced quantity is different from the item's current quantity
    if (debouncedQuantity !== item.quantity) {
      const payload = {
        lineId: item.id,
        variantId: item.merchandise.id,
        quantity: debouncedQuantity
      };
      formAction(payload);
    }
  }, [debouncedQuantity, item.id, item.merchandise.id, formAction, item.quantity]);

  const handleClick = () => {
    setAccumulatedQuantity((prevQuantity) =>
      Math.max(prevQuantity + (type === 'plus' ? 1 : -1), 1)
    );
  };

  return (
    <div>
      <SubmitButton type={type} onClick={handleClick} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </div>
  );
}
