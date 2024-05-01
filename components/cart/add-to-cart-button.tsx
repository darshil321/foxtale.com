'use client';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  buttonClasses
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  buttonClasses: string;
}) {
  const { pending } = useFormStatus();

  const disabledClasses = 'cursor-not-allowed  hover:opacity-80';

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
        Add To Cart
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      <div className="absolute left-0 ml-4"></div>
      Add To Cart
    </button>
  );
}

export function AddToCartButton({
  variants,
  availableForSale,
  buttonClasses
}: {
  variants: any[];
  availableForSale: boolean;
  buttonClasses: string;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const searchParams = useSearchParams();
  const defaultVariantId = variants?.length === 1 ? variants[0]?.id : undefined;
  const variant = variants?.find((variant: ProductVariant) =>
    variant.selectedOptions?.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;
  const actionWithVariant = formAction.bind(null, selectedVariantId);

  return (
    <form action={actionWithVariant}>
      <SubmitButton
        availableForSale={availableForSale}
        buttonClasses={buttonClasses}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
