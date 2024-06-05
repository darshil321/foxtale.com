'use client';
import clsx from 'clsx';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { cartActions } from 'store/actions/cart.action';
import { getDefaultVariant } from '@/lib/helper/helper';
import { setCartOpen } from '@/store/slices/cart-slice';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
// import { sendGAEvent } from '@next/third-parties/google';

// import { fbEvent } from 'utils/facebook-pixel';
import { scrollToElementById } from '@/lib/utils';
import { trackEvent } from 'utils/mixpanel';
import { getSource } from '@/lib/helper/helper';
const ToastContent: React.FC = () => {
  const dispatch = useDispatch();
  const cart = useAppSelector((state) => state.cart.cart);

  return (
    <div className="flex justify-between">
      <div className="flex">
        <img height={20} width={20} src="/Images/tick.svg" alt="" />
        <span className="ml-2 text-black">Product Added To Cart!</span>
      </div>
      <div
        className="text-[15px] font-semibold capitalize text-[#1877f2]"
        onClick={() => {
          trackEvent('Viewed Cart', {
            from: 'view-cart-popup',
            source: getSource(window.location.href),
            cart: cart
          });
          dispatch(setCartOpen(true));
          toast.dismiss();
        }}
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
  const cart = useAppSelector((state) => state.cart.cart);

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
          dispatch(
            cartActions.addToCart({
              selectedVariantId: selectedVariantId,
              product: product
            })
          );

          const parts = product.id.split('/');
          const id = parts[parts.length - 1];

          if (window && window.dataLayer) {
            window.dataLayer.push({
              event: 'add_to_cart',
              ga: {
                currency: 'INR',
                value: product?.priceRange?.maxVariantPrice?.amount,
                items: [
                  {
                    item_id: selectedVariantId,
                    item_name: product?.title,
                    price: product?.priceRange?.maxVariantPrice?.amount,
                    quantity: 1
                  }
                ]
              },
              fb: {
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
                currency: product?.priceRange?.minVariantPrice?.currencyCode,
                value: product?.priceRange?.minVariantPrice?.amount,
                num_items: 1
              }
            });
          }

          trackEvent('Added to cart', {
            productName: product.title,
            productUrl: window.location.href,
            productPrice: product?.priceRange?.maxVariantPrice?.amount,
            productCurrency: product?.priceRange?.maxVariantPrice?.currencyCode,
            category: '',
            from:
              getSource(window.location.href) === 'product'
                ? 'from-pdp'
                : 'from-feature-collection',
            cart: cart,
            source: getSource(window.location.href),
            'api-url-for-data': window.location.href,
            tags: product.tags.join(','),
            varientSku: ''
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
