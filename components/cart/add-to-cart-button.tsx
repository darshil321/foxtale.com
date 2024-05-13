'use client';
// import { cartActions } from '@/store';
import clsx from 'clsx';
// import { addItem } from 'components/cart/actions';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { useAppDispatch } from 'store/hooks';
import { cartActions } from 'store/actions/cart.action';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultVariant } from '@/lib/helper/helper';
import { setCartOpen } from '@/store/slices/cart-slice';

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

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
        dispatch(setCartOpen(true));
        dispatch(
          cartActions.addToCart({
            selectedVariantId: selectedVariantId,
            product: product,
            tempId: uuidv4()
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
  const defaultVariant = getDefaultVariant(product);
  const variant = variants?.find((variant: ProductVariant) =>
    variant.selectedOptions?.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariant.id;

  return (
    <SubmitButton
      availableForSale={availableForSale}
      buttonClasses={buttonClasses}
      selectedVariantId={selectedVariantId}
      product={product}
    />
  );
}
