'use client';
import React, { useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { HiX } from 'react-icons/hi';
import EditItemForm from './edit-item-form';
import Modal from 'react-modal';
import { useAppDispatch } from 'store/hooks';
// import { productActions } from 'store/actions/product.actions';
import { cartActions } from 'store/actions/cart.action';
import Image from 'next/image';

import { Cart } from 'lib/shopify/types';
import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import { getMetaObjects } from 'lib/shopify';
// import { cookies } from 'next/headers';

// const products = [
//   {
//     name: 'Overnight Glow Mask',
//     option: 'Single',
//     mrp: 600,
//     price: 595,
//     quantity: 2,
//     imageSrc: 'https://foxtale.in/cdn/shop/files/PDP---First-Image-16.jpg?v=1712244428&width=240'
//   },
//   {
//     name: 'Hydrating Moisturizer with Ceramide',
//     option: 'Single',
//     price: 300,
//     quantity: 3,
//     imageSrc: 'https://foxtale.in/cdn/shop/files/PDP---First-Image-09.jpg?v=1712244190&width=240'
//   }
// ];

const AddToCart = ({ cart }: { cart: Cart | undefined }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  // const data = useAppSelector((state) => state.products.products);
  console.log('data', cart);

  useEffect(() => {
    const fetchData = async () => {
      console.log('attempt product: sagaa');
      const data = await getMetaObjects();
      console.log('datam', data);

      // Assuming getMetaObjects() is an async function
      dispatch(
        cartActions.attemptGetCarts({
          cartId:
            'gid://shopify/Cart/Z2NwLWFzaWEtc291dGhlYXN0MTowMUhXU0I5MFREMVpGVEtCNTJQQ0tWRVo2Wg'
        })
      );
    };

    fetchData(); // Call the async function

    // You cannot rely on `products` being updated immediately after dispatch
    // console.log('attempt product: sagaa1', products);
  }, [dispatch]);

  return (
    <div className="w-full md:px-40 lg:py-20">
      <Modal
        shouldFocusAfterRender={false}
        style={{
          content: {
            paddingTop: '24px',
            paddingBottom: '20px'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }
        }}
        className="mx-auto mt-60   w-1/3 rounded-lg bg-white p-8 shadow-2xl"
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <HiX
          className="rounded-full bg-black p-1 text-3xl text-white hover:bg-green-500"
          style={{
            float: 'right',
            cursor: 'pointer',
            marginTop: '-1.75rem',
            marginRight: '-2.2rem'
          }}
          onClick={() => setModalIsOpen(false)}
        />
        <EditItemForm />
      </Modal>
      <div className="grid grid-cols-6 gap-4 py-2 text-sm font-semibold">
        <div className="col-span-3">PRODUCT</div>
        <div className="hidden text-center sm:block">PRICE</div>
        <div className="hidden text-center sm:block">QUANTITY</div>
        <div className="hidden text-center sm:block">TOTAL</div>
      </div>

      <hr className="bg-gray-400" />

      {!cart || cart.lines.length === 0 ? (
        <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
          <ShoppingBagIcon className="h-16" />
          <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
        </div>
      ) : (
        cart.lines.map((item, index) => (
          <div key={index} className="grid gap-4 py-8 sm:grid-cols-1 lg:grid-cols-6">
            <div className="flex sm:grid-cols-1 lg:col-span-3">
              <div>
                <Image
                  className="h-full w-full object-cover"
                  width={120}
                  height={120}
                  alt={
                    item.merchandise.product.featuredImage.altText || item.merchandise.product.title
                  }
                  src={item.merchandise.product.featuredImage.url}
                />
              </div>
              <div className="flex flex-col justify-between py-6 pl-4">
                <p className="cursor-pointer font-medium hover:text-green-500">
                  {item.merchandise.product.title}
                </p>
                {/* <p className="text-sm"> */}
                {/* <span className="text-gray-500">Option:</span>
                  <span className="font-semibold text-gray-500">{product.option}</span> */}
                {/* </p> */}
                <div className="mt-1 flex space-x-2">
                  <FiEdit
                    onClick={() => setModalIsOpen(true)}
                    className="cursor-pointer text-lg text-gray-600"
                  />
                  <DeleteItemButton item={item} removeIcon={true} />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center text-center text-gray-500">
              {/* {item.cost && (
                <span className="mr-1 text-black line-through">{'₹' + item.cost ?? ''}</span>
              )} */}
              <span className={`${item.cost ? 'text-red-500' : 'text-black'}`}>
                {'₹' + Number(item.cost.totalAmount.amount) / item.quantity}
              </span>
            </div>
            <div className="justify-left flex items-center text-center">
              <div className="mx-auto flex h-9 flex-row  items-center rounded-full border border-neutral-500 ">
                <EditItemQuantityButton item={item} type="minus" />
                <p className="w-6 text-center">
                  <span className="w-full text-sm">{item.quantity}</span>
                </p>
                <EditItemQuantityButton item={item} type="plus" />
              </div>
            </div>
            <div className="flex items-center justify-center text-center font-semibold text-gray-500">
              ₹{item.cost.totalAmount.amount}
            </div>
          </div>
        ))
      )}

      <hr />
    </div>
  );
};

export default AddToCart;
