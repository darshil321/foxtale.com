'use client';
// import { cartActions } from '@/store';
import clsx from 'clsx';
// import { addItem } from 'components/cart/actions';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { useAppDispatch } from 'store/hooks';
import { cartActions } from 'store/actions/cart.action';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  buttonClasses,
  product
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  buttonClasses: string;
  product: Product;
}) {
  const dispatch = useAppDispatch();
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
        onClick={() => {
          dispatch(
            cartActions.addToCart({
              selectedVariantId: selectedVariantId,
              product: product
            })
          );
        }}
        aria-label="Please select an option"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Add To Carttt
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
        dispatch(
          cartActions.addToCart({
            selectedVariantId: selectedVariantId,
            product: product
          })
        );
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      Add To Cart
    </button>
  );
}

export function AddToCartButton({
  variants,
  availableForSale,
  buttonClasses,
  product
}: {
  variants: any[];
  availableForSale: boolean;
  buttonClasses: string;
  product: Product;
}) {
  const searchParams = useSearchParams();
  const defaultVariantId = variants?.length === 1 ? variants[0]?.id : undefined;
  const variant = variants?.find((variant: ProductVariant) =>
    variant.selectedOptions?.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );

  const selectedVariantId = variant?.id || defaultVariantId;

  console.log('variantDD', product, variant);

  return (
    <SubmitButton
      availableForSale={availableForSale}
      buttonClasses={buttonClasses}
      selectedVariantId={selectedVariantId}
      product={product}
    />
  );
}
