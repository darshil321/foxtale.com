'use client';
import React from 'react';

import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import Image from 'next/image';

function SubmitButton({
  type,
  onClick,
  pending
}: {
  type: 'plus' | 'minus' | 'trash';
  // eslint-disable-next-line no-unused-vars
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  pending?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      aria-disabled={pending}
      className={clsx(
        'ease flex h-full min-w-[28px] max-w-[32px] flex-none items-center justify-center rounded-full px-1 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'cursor-not-allowed': pending,
          'ml-auto': type === 'minus'
        }
      )}
    >
      {pending ? (
        <LoadingDots className="bg-black" />
      ) : type === 'plus' ? (
        <Image src="/Images/plus.svg" alt="Plus Icon" height={12} width={12} />
      ) : type === 'trash' ? (
        <Image src="/Images/trash.svg" alt="trash Icon" height={12} width={12} />
      ) : (
        <svg
          className="h-4 w-3"
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="2"
          viewBox="0 0 8 2"
          fill="none"
        >
          <path
            d="M0.521739 0.463745C0.233593 0.463745 0 0.697345 0 0.985484C0 1.27362 0.233593 1.50722 0.521739 1.50722V0.463745ZM4 1.50722C4.28814 1.50722 4.52174 1.27362 4.52174 0.985484C4.52174 0.697345 4.28814 0.463745 4 0.463745V1.50722ZM4 0.463745C3.71186 0.463745 3.47826 0.697345 3.47826 0.985484C3.47826 1.27362 3.71186 1.50722 4 1.50722V0.463745ZM7.47826 1.50722C7.7664 1.50722 8 1.27362 8 0.985484C8 0.697345 7.7664 0.463745 7.47826 0.463745V1.50722ZM4.52174 0.985484C4.52174 0.697345 4.28814 0.463745 4 0.463745C3.71186 0.463745 3.47826 0.697345 3.47826 0.985484H4.52174ZM3.47826 0.985484C3.47826 1.27362 3.71186 1.50722 4 1.50722C4.28814 1.50722 4.52174 1.27362 4.52174 0.985484H3.47826ZM0.521739 1.50722H4V0.463745H0.521739V1.50722ZM4 1.50722H7.47826V0.463745H4V1.50722Z"
            fill="black"
          ></path>
        </svg>
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
  type: 'plus' | 'minus' | 'trash';
}) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SubmitButton
        type={type}
        onClick={() => {
          onClick();
        }}
      />
    </form>
  );
}
