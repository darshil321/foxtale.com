'use client';
import React from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import { useFormStatus } from 'react-dom';

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
  onClick,
  type
}: {
  onClick: () => void;
  // eslint-disable-next-line no-unused-vars
  type: 'plus' | 'minus';
}) {
  const { pending } = useFormStatus();

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SubmitButton
        type={type}
        onClick={(e) => {
          onClick(e);
        }}
        pending={pending}
      />
    </form>
  );
}
