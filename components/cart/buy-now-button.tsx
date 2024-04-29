'use client';
import clsx from 'clsx';
import { useFormStatus } from 'react-dom';

export function BuyNowButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: any;
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex text-sm items-center border-black border font-normal md:font-semibold justify-center bg-black py-2 px-6 md:py-2 md:px-8 uppercase  tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed hover:opacity-80';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Select Option
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
        // handlePurchase(selectedVariantId);
      }}
      aria-label="Buy Now"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      Buy Now
    </button>
  );
}
