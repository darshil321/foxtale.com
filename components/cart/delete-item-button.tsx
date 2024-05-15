'use client';

import { cartActions } from '@/store/actions/cart.action';
import { useAppDispatch } from '@/store/hooks';
import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import type { CartItem } from 'lib/shopify/types';
import { useFormStatus } from 'react-dom';

function SubmitButton({ removeIcon, item }: { removeIcon?: boolean; item?: CartItem }) {
  const { pending } = useFormStatus();
  const dispatch = useAppDispatch();
  return (
    <button
      type="submit"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
        dispatch(cartActions.removeCart({ lineIds: [item?.id] }));
      }}
      aria-label="Remove cart item"
      aria-disabled={pending}
      className={clsx(
        'ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
        {
          'cursor-not-allowed px-0': pending
        }
      )}
    >
      {pending ? (
        <LoadingDots className="bg-white" />
      ) : removeIcon ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" width="17">
          <use href="#icon-cart-remove"></use>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
          data-slot="icon"
          className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white "
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
        </svg>
      )}
    </button>
  );
}

export function DeleteItemButton({ item, removeIcon }: { item: CartItem; removeIcon?: boolean }) {
  return (
    <>
      <SubmitButton removeIcon={removeIcon} item={item} />
    </>
  );
}
