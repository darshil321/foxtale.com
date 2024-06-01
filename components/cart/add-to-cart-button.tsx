'use client';
import clsx from 'clsx';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from 'store/hooks';
import { cartActions } from 'store/actions/cart.action';
import { getDefaultVariant } from '@/lib/helper/helper';
import { setCartOpen, setLoading } from '@/store/slices/cart-slice';
import { trackEvent } from 'utils/mixpanel';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { sendGAEvent } from '@next/third-parties/google';

import { fbEvent } from 'utils/facebook-pixel';
import { scrollToElementById } from '@/lib/utils';
const ToastContent: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <img height={20} width={20} src="/Images/tick.svg" alt="" />
        <span className="ml-2 text-black">Product Added To Cart!</span>
      </div>
      <div
        className="text-[15px] font-semibold capitalize text-[#1877f2]"
        onClick={() => dispatch(setCartOpen(true))}
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
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
      autoClose: 3000,
      hideProgressBar: true,
      closeButton: false,
      transition: Slide
    });

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          notify();
          scrollToElementById('routine');
          dispatch(setLoading(true));
          dispatch(
            cartActions.addToCart({
              selectedVariantId: selectedVariantId,
              product: product
            })
          );
          sendGAEvent({
            event: 'Add To Cart',
            value: {
              Product_Name: product.title,
              Product_Url: '',
              Product_Price: product?.priceRange?.maxVariantPrice?.amount,
              Price_Currency: product?.priceRange?.maxVariantPrice?.currencyCode,
              Source: '',
              Category: '',
              Tags: product.tags,
              Variant_SKU: ''
            }
          });

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
          const parts = product.id.split('/');
          const id = parts[parts.length - 1];
          fbEvent('AddToCart', {
            content_ids: [id],
            content_name: product.title,
            content_type: 'product',
            content_category: 'recommended',
            contents: [
              {
                id: id,
                quantity: 1,
                price: product?.priceRange?.minVariantPrice?.amount,
                title: product.title,
                handle: product.handle,
                description: product.description
              }
            ],
            // content_collections: product.collections,
            currency: product?.priceRange?.minVariantPrice?.currencyCode,
            value: product?.priceRange?.minVariantPrice?.amount,
            num_items: 1
            //===
            // fbc: getFbpCookie()
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
