'use client';
import clsx from 'clsx';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from 'store/hooks';
import { cartActions } from 'store/actions/cart.action';
import { getDefaultVariant } from '@/lib/helper/helper';
import { setCartOpen } from '@/store/slices/cart-slice';
import { trackEvent } from 'utils/mixpanel';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
const ToastContent: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between">
      <img height={25} width={25} src="/Images/tick.png" alt="" />
      Product Added To Cart!
      <div
        className=" text-blue-600"
        onClick={() => dispatch(setCartOpen(true))}
        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
      >
        View Cart
      </div>
    </div>
  );
};

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

  const disabledClasses = 'cursor-not-allowed  hover:opacity-80';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }
  const notify = () =>
    toast(<ToastContent />, {
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: true,
      transition: Slide
    });

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          notify();
          // dispatch(setCartOpen(true));
          dispatch(
            cartActions.addToCart({
              selectedVariantId: selectedVariantId,
              product: product
            })
          );
          trackEvent('Add To Cart', {
            Product_Name: product.title,
            Product_Url: '',
            Product_Price: product?.priceRange?.maxVariantPrice?.amount,
            Price_Currency: product?.priceRange?.maxVariantPrice?.currencyCode,
            Source: '',
            Category: '',
            Tags: product.tags,
            Variant_SKU: ''
          });
        }}
        aria-label="Add to cart"
        className={clsx(buttonClasses, {
          'hover:opacity-90': true
        })}
      >
        Add To Cart
      </button>
    </>
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
  console.log();

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
