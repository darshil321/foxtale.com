'use client';
import { Dialog, Transition } from '@headlessui/react';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useMemo } from 'react';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import '../../assets/styles/embla-products-carousel.css';
import useCoupon from '@/lib/hooks/use-coupon';
import { debounce, getCartData } from '@/lib/helper/helper';
import { CartItem } from '@/lib/shopify/types';
import { setCartOpen, setUpdateCartLoading } from '@/store/slices/cart-slice';
import { cartActions } from '@/store/actions/cart.action';
import { GokwikButton } from '../product/go-kwik-button';
import { v4 as uuidv4 } from 'uuid';

import { EmblaOptionsType } from 'embla-carousel';
import EmblaCartSlider from '../common/gift-cart-slider';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const carts = useAppSelector((state) => state.cart.cart);
  const { adjustFreebiesInCart } = useCoupon();

  const data = getCartData(carts);
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

    const { cartToBeUpdate, itemsToBeAdd, giftProducts } = adjustFreebiesInCart(cart);
    console.log('cartToBeUpdate', cartToBeUpdate);
    console.log('itemsToBeAdd', itemsToBeAdd);
    console.log('giftProducts', giftProducts);
    const updatedCart = cartToBeUpdate.lines?.map((item: CartItem) => ({
      id: item.id,
      merchandiseId: item.merchandise.id,
      quantity: item.quantity
    }));

    const _cart = {
      ...carts,
      lines: cartToBeUpdate.lines.filter((line: any) => line.quantity > 0)
    };
    dispatch(cartActions.setCart(_cart));
    dispatch(setUpdateCartLoading(true));

    debouncedUpdateItemQuantity(updatedCart, itemsToBeAdd);
  }

  const debouncedUpdateItemQuantity = useMemo(
    () =>
      debounce((updatedCart, itemsToBeAdd) => {
        dispatch(cartActions.updateCart(updatedCart));
        if (itemsToBeAdd.length)
          itemsToBeAdd.forEach((item: any) => {
            dispatch(
              cartActions.addToCart({
                selectedVariantId: item.variantId,
                product: item.product,
                tempId: uuidv4()
              })
            );
          });

        // if (carts?.id) dispatch(cartActions.attemptGetCarts({ cartId: carts.id }));
      }, 1000),
    [dispatch]
  );

  const { isCartOpen } = useAppSelector((state) => state.cart);
  // useEffect(() => {
  // setIsOpen(isCartOpen);
  // }, [isCartOpen]);

  const OPTIONS: EmblaOptionsType = { dragFree: false };

  return (
    <>
      <button aria-label="Open cart" onClick={() => dispatch(setCartOpen(true))}>
        <OpenCart quantity={data?.totalQuantity} />
      </button>
      <Transition show={!!isCartOpen}>
        <Dialog onClose={() => dispatch(setCartOpen(false))} className="relative z-50">
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
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white p-6 text-black  md:w-[390px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>

                <button aria-label="Close carts" onClick={() => dispatch(setCartOpen(false))}>
                  <Image src="/Images/close.svg" alt="close" width={24} height={24} />
                </button>
              </div>

              {!carts || carts?.lines?.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <Image
                    src="/Images/Shopping-cart.svg"
                    alt="empty-cart"
                    width={100}
                    height={100}
                  />
                  <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="flex-grow overflow-auto py-4">
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
                        <li key={i} className="flex w-full flex-col">
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} removeIcon={false} />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={() => dispatch(setCartOpen(false))}
                              className="z-30 flex flex-row space-x-4"
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

                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {item.merchandise.product.title}
                                </span>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 ">
                                    {item.merchandise.title}
                                  </p>
                                ) : null}
                              </div>
                            </Link>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm"
                                amount={(
                                  item?.quantity * Number(item?.cost?.amountPerQuantity?.amount)
                                ).toString()}
                                currencyCode={item?.cost?.totalAmount?.currencyCode}
                              />
                              <div className="ml-auto flex h-9 flex-row items-center  border border-neutral-200 ">
                                <EditItemQuantityButton
                                  onClick={() => {
                                    increaseItemQuantity({ item, type: 'minus' });
                                  }}
                                  type="minus"
                                />

                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton
                                  onClick={() => increaseItemQuantity({ item, type: 'plus' })}
                                  type="plus"
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                    <div className="max-h-60 w-full">
                      <EmblaCartSlider slides={carts.lines} options={OPTIONS} />
                    </div>
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 ">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
                      <p>Total</p>
                      <Price
                        className="text-right text-base text-black "
                        amount={totalAmount?.toString() || '0'}
                        currencyCode={currencyCode}
                      />
                    </div>
                  </div>
                  <GokwikButton title={'Proceed To Checkout'} buyNowButton={true} quantity={1} />
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
