'use client';
import { Dialog, Transition } from '@headlessui/react';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect } from 'react';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import '../../assets/styles/embla-products-carousel.css';
import useCoupon from '@/lib/hooks/use-coupon';
import { getCartData } from '@/lib/helper/helper';
import { CartItem } from '@/lib/shopify/types';
import { setCartOpen } from '@/store/slices/cart-slice';
import { GokwikButton } from '../product/go-kwik-button';
import { EmblaOptionsType } from 'embla-carousel';

import { cartActions } from '@/store/actions/cart.action';
import EmblaProductSlider from '../common/recommended-product-slider';
import LoadingOverlay from '../common/loading';

type MerchandiseSearchParams = {
  [key: string]: string;
};
const couponDescriptionLine = <b>FOX1099</b>;
const minimumCartItems = 3;
export default function CartModal() {
  const carts = useAppSelector((state) => state.cart.cart);
  const { giftFreeProducts } = useAppSelector((state) => state.cart);
  const { loading } = useAppSelector((state) => state.cart);
  const RecommendedProducts = useAppSelector((state) => state.cart.recommendedProducts);

  const { adjustCart } = useCoupon();

  const data = getCartData(carts);
  const totalCartQuantity = data.totalQuantity;

  const { currencyCode, totalAmount } = data;
  const dispatch = useAppDispatch();
  function increaseItemQuantity({ item, type }: { item: CartItem; type: string }) {
    const cart = {
      ...carts,
      lines: carts.lines.map((line: any) => {
        if (line.merchandise.id === item.merchandise.id) {
          if (type === 'plus') {
            return {
              ...line,
              quantity: line.quantity + 1
            };
          } else {
            return {
              ...line,
              quantity: line.quantity - 1
            };
          }
        }
        return line;
      })
    };

    adjustCart(cart);
  }

  useEffect(() => {
    // if (Array.isArray(carts) && carts.length > 0 && carts[0].merchandise) {
    //   productId = carts[0].merchandise.product.id;
    // } else if (Array.isArray(carts.lines) && carts.lines.length > 0 && carts.lines[0].merchandise) {
    if (carts && carts?.lines?.length > 0) {
      const productId = carts?.lines[0].merchandise.product.id;
      // }

      // if (productId) {
      dispatch(cartActions.setRecommendedProduct({ productId }));
    }

    // }
  }, [carts, dispatch]);

  const { isCartOpen } = useAppSelector((state) => state.cart);

  const OPTIONS: EmblaOptionsType = { dragFree: false };

  return (
    <>
      <button aria-label="Open cart" onClick={() => dispatch(setCartOpen(true))}>
        <OpenCart quantity={data?.totalQuantity} />
      </button>
      <Transition show={!!isCartOpen}>
        <Dialog onClose={() => dispatch(setCartOpen(false))} className="relative z-50 ">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white  text-black  md:w-[390px]">
              <div className="flex items-center justify-between border-b p-2 ">
                <p className="w-full text-lg">Your Cart</p>

                <button aria-label="Close carts" onClick={() => dispatch(setCartOpen(false))}>
                  <CloseCart />
                </button>
              </div>
              <p className="bg-grey px-2 py-2 text-xs">Free Shipping + Free Sachet</p>

              {loading && <LoadingOverlay isLoading={loading} />}
              {!carts || carts?.lines?.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingBagIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                </div>
              ) : (
                <div className="bg-gray flex h-full flex-col justify-between overflow-hidden">
                  <ul className="flex-grow overflow-auto bg-grey p-2 py-1 ">
                    {carts?.lines?.map((item: any, i: number) => {
                      const merchandiseSearchParams = {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(
                        ({ name, value }: { name: string; value: string }) => {
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[name.toLowerCase()] = value;
                          }
                        }
                      );

                      const merchandiseUrl = createUrl(
                        `/product/${item.merchandise?.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );

                      return (
                        <li key={i} className="flex w-full flex-col rounded-md  bg-white p-1">
                          <div className="relative flex w-full flex-row justify-between rounded-sm px-1 py-1 ">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} removeIcon={false} />
                            </div>

                            <div className="flex h-full w-full items-center justify-between">
                              <Link
                                href={merchandiseUrl}
                                onClick={() => dispatch(setCartOpen(false))}
                                className=" flex flex-row space-x-4"
                              >
                                <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md  border border-neutral-300 bg-neutral-300 ">
                                  <Image
                                    className="h-full w-full object-cover"
                                    width={64}
                                    height={64}
                                    alt={
                                      item.merchandise.product.featuredImage.altText ||
                                      item.merchandise.product.title
                                    }
                                    src={item.merchandise.product.featuredImage.url}
                                  />
                                </div>

                                <div>
                                  <div className="flex flex-1 flex-col gap-0.5 py-2">
                                    <span className="text-xs leading-tight">
                                      {item.merchandise.product.title.substring(0, 20)}
                                      {item.merchandise.product.title?.length > 20 && '...'}
                                    </span>
                                    {Number(item?.cost?.amountPerQuantity?.amount) === 0 && (
                                      <div className="w-max rounded-md bg-[#9ee67f] px-2 text-xs text-green-700">
                                        free
                                      </div>
                                    )}
                                    {item.merchandise.title !== DEFAULT_OPTION ? (
                                      <p className="text-xs text-neutral-500 ">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                    {/* <div className="t4s-product-price text-base font-medium">
                                      <span className="font-poppins text-xs">
                                        {' '}
                                        ₹{' '}
                                        {item?.quantity *
                                          Number(item?.cost?.amountPerQuantity?.amount)}
                                      </span>
                                    </div> */}
                                    {Number(item?.cost?.amountPerQuantity?.amount) != 0 && (
                                      <Price
                                        className="flex justify-end space-y-2 text-right text-sm"
                                        amount={(
                                          item?.quantity *
                                          Number(item?.cost?.amountPerQuantity?.amount)
                                        ).toString()}
                                        currencyCode={item?.cost?.totalAmount?.currencyCode}
                                      />
                                    )}
                                  </div>
                                </div>
                              </Link>
                              <div className="flex h-full flex-col items-center justify-between">
                                {Number(item?.cost?.amountPerQuantity?.amount) !== 0 && (
                                  <div className="ml-auto flex h-6 w-full flex-row items-center border border-neutral-200 ">
                                    {item.quantity > 1 && (
                                      <EditItemQuantityButton
                                        onClick={() => {
                                          increaseItemQuantity({ item, type: 'minus' });
                                        }}
                                        type="minus"
                                      />
                                    )}
                                    {item.quantity === 1 && (
                                      <EditItemQuantityButton
                                        onClick={() => {
                                          increaseItemQuantity({ item, type: 'minus' });
                                        }}
                                        type="trash"
                                      />
                                    )}
                                    <p className="w-6 text-center">
                                      <span className="w-full text-sm">{item.quantity}</span>
                                    </p>
                                    <EditItemQuantityButton
                                      onClick={() => increaseItemQuantity({ item, type: 'plus' })}
                                      type="plus"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                    {RecommendedProducts &&
                      RecommendedProducts.length > 0 &&
                      carts?.lines?.length > 0 && (
                        <div className="mt-4 max-h-60 w-full rounded-md border border-white bg-white p-2 shadow-sm">
                          <div className="mb-3 font-medium ">Recommended Products</div>
                          <EmblaProductSlider
                            slides={RecommendedProducts}
                            options={OPTIONS}
                            type={'product'}
                          />
                        </div>
                      )}
                    {giftFreeProducts && giftFreeProducts?.length > 0 && (
                      <div className="mt-4 max-h-60 w-full rounded-md border border-white bg-white p-2 shadow-sm">
                        <div className="mb-3 font-medium ">Gift Products</div>
                        <EmblaProductSlider
                          slides={giftFreeProducts}
                          options={OPTIONS}
                          type={'gift'}
                        />
                      </div>
                    )}
                  </ul>

                  <div>
                    {totalCartQuantity > minimumCartItems && (
                      <div className="bg-[#ffe1d7] p-2 text-xs">
                        <p className="flex flex-row gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 30 30"
                            width="16px"
                            height="16px"
                            className="flex items-center"
                          >
                            <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M16,21h-2v-7h2V21z M15,11.5 c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5S15.828,11.5,15,11.5z" />
                          </svg>
                          <span className="text-xs">
                            {' Use Code: '}
                            {couponDescriptionLine}
                            {' at checkout to unlock the De-Tan Scrub'}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="items-cener flex flex-col p-2">
                    <div className="py-1 text-lg">
                      <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1">
                        <p className="font-bold">Subtotal:</p>
                        <Price
                          className="text-right text-base text-black "
                          amount={totalAmount?.toString() || '0'}
                          currencyCode={currencyCode}
                        />
                      </div>
                    </div>

                    <GokwikButton title={'Proceed To Checkout'} buyNowButton={true} quantity={1} />
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
