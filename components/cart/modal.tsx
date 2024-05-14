'use client';
import { Dialog, Transition } from '@headlessui/react';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useMemo } from 'react';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from 'store/hooks';

import useCoupon from '@/lib/hooks/use-coupon';
import { debounce, getCartData } from '@/lib/helper/helper';
import { CartItem } from '@/lib/shopify/types';
import { setCart, setCartOpen } from '@/store/slices/cart-slice';
import { cartActions } from '@/store/actions/cart.action';
import { GokwikButton } from '../product/go-kwik-button';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  // const [isOpen, setIsOpen] = useState(false);

  const carts = useAppSelector((state) => state.cart.cart);
  const { adjustFreebiesInCart } = useCoupon();

  const data = getCartData(carts);
  const { currencyCode, totalAmount } = data;
  const dispatch = useAppDispatch();
  function increaseItemQuantity({ cart, item, type }: { cart: any; item: CartItem; type: string }) {
    const updatedCart = JSON.parse(JSON.stringify(cart));
    updatedCart.totalQuantity++;

    const index = updatedCart.lines.findIndex(
      (line: any) => line.merchandise.id === item.merchandise.id
    );

    if (index !== -1) {
      type === 'plus' ? updatedCart.lines[index].quantity++ : updatedCart.lines[index].quantity--;

      updatedCart.lines[index].cost.totalAmount.amount =
        updatedCart.lines[index].cost.amountPerQuantity.amount * updatedCart.lines[index].quantity;
    }

    dispatch(setCart(updatedCart));

    const payload = updatedCart?.lines
      ?.filter((item: CartItem) => Number(item.cost.amountPerQuantity.amount) !== 0)
      ?.map((item: CartItem) => ({
        id: item.id,
        merchandiseId: item.merchandise.id,
        quantity: item.quantity
      }));

    console.log('Updated', payload);
    const { removableCartLineIds } = adjustFreebiesInCart(updatedCart);
    debouncedUpdateItemQuantity(payload, removableCartLineIds);
  }
  const debouncedUpdateItemQuantity = useMemo(
    () =>
      debounce((payload, removableCartLineIds) => {
        dispatch(cartActions.updateCart(payload));
        if (removableCartLineIds?.length > 0)
          dispatch(cartActions.removeCart({ lineIds: removableCartLineIds }));
      }, 1000),
    [dispatch]
  );

  const { isCartOpen } = useAppSelector((state) => state.cart);
  // useEffect(() => {
  // setIsOpen(isCartOpen);
  // }, [isCartOpen]);

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
                  <CloseCart />
                </button>
              </div>

              {!carts || carts?.lines?.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingBagIcon className="h-16" />
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
                                    if (item.quantity > 1) {
                                      increaseItemQuantity({ cart: carts, item, type: 'minus' });
                                    } else {
                                      dispatch(cartActions.removeCart({ lineIds: [item.id] }));
                                    }
                                  }}
                                  type="minus"
                                />

                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton
                                  onClick={() =>
                                    increaseItemQuantity({ cart: carts, item, type: 'plus' })
                                  }
                                  type="plus"
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
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
