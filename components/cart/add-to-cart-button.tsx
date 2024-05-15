'use client';
// import { cartActions } from '@/store';
import clsx from 'clsx';
// import { addItem } from 'components/cart/actions';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { cartActions } from 'store/actions/cart.action';
import { v4 as uuidv4 } from 'uuid';
import { getCartItem, getDefaultVariant } from '@/lib/helper/helper';
import { setCartOpen } from '@/store/slices/cart-slice';
import useCoupon from '@/lib/hooks/use-coupon';

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
  const cart = useAppSelector((state) => state.cart.cart) || {};
  const { adjustCart } = useCoupon();

  const disabledClasses = 'cursor-not-allowed  hover:opacity-80';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  const updateCart = (tempId: string) => {
    const variant = getDefaultVariant(product, selectedVariantId);
    if (!variant) {
      return;
    }
    const productArray = cart?.lines || [];
    const productFound = productArray?.find((item: any) => item.merchandise.id === variant.id);

    let cartLines;
    if (productFound) {
      cartLines = productArray?.map((line: any) => {
        if (line.id === productFound.id) {
          return {
            ...productFound,
            quantity: productFound.quantity + 1
          };
        } else {
          return line;
        }
      });
    } else {
      const cartItem = getCartItem(tempId, product, variant);
      cartLines = [...productArray, cartItem];
    }
    console.log('@', cart);
    if (!cart || cart?.lines) {
      return { lines: cartLines, totalQuantity: 1 };
    } else {
      return {
        ...cart.cart,
        lines: cartLines,
        totalQuantity: cart?.totalQuantity + 1
      };
    }
  };

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(setCartOpen(true));
        const tempId = uuidv4();
        dispatch(
          cartActions.addToCart({
            selectedVariantId: selectedVariantId,
            product: product,
            tempId,
            blockReducer: true
          })
        );
        dispatch(cartActions.createCart());

        const cart = updateCart(tempId);

        adjustCart(cart);
        dispatch(cartActions.setCart(cart));
      }}
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true
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
