'use client';
import { createCustomer, createReview } from '@/lib/shopify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProductReviews, setUserFormOpen } from '@/store/slices/product-slice';
import { setFeraUser } from '@/store/slices/user-slice';
import React, { useState } from 'react';
import ReactModal from 'react-modal';
import Image from 'next/image';

// import { GokwikButton } from 'components/elements/gokwik-button';

const UserForm = () => {
  function getLastElement(array: any[]) {
    if (!array || array?.length === 0) {
      return null;
    }
    return array[array.length - 1];
  }
  const [user, setUser] = useState({
    name: '',
    email: ''
  });
  const dispatch = useAppDispatch();
  const isUserFormOpen = useAppSelector((state) => state.products.isUserFormOpen);
  const productReviews = useAppSelector((state) => state.products.productReviews);
  return (
    <ReactModal
      shouldReturnFocusAfterClose={false}
      shouldFocusAfterRender={false}
      className=" mx-auto my-auto mt-[130px] w-[400px] rounded-md  bg-white font-poppins  shadow-md  "
      isOpen={isUserFormOpen}
    >
      <div
        onClick={() => {
          dispatch(setUserFormOpen(false));
        }}
        className="relative flex cursor-pointer items-center justify-end rounded-md p-4 text-black transition-colors "
      >
        <Image src={'/Images/close.svg'} alt={'close'} width={25} height={25} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createCustomer(user).then((res) => {
            const feraUser = {
              id: res.id,
              name: res.name,
              email: res.email
            };
            const reviewObject = getLastElement(productReviews);
            const review = { ...reviewObject, customer: feraUser };
            createReview(review).then((res) => {
              dispatch(setProductReviews({ ...review, id: res.id }));
            });

            dispatch(setFeraUser(feraUser));
            dispatch(setUserFormOpen(false));
          });
        }}
      >
        <h1 className="mt-6 pt-6 text-center text-2xl">Just a couple more things...</h1>
        <div className="p-8 text-gray-500">
          <div className="grid grid-cols-3 items-center">
            <label htmlFor="name">Name:</label>
            <input
              required
              className="col-span-2"
              placeholder="Enter name"
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                margin: '8px 0'
              }}
              type="text"
              id="name"
              name="name"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label htmlFor="email">Email:</label>

            <input
              required
              className="col-span-2"
              placeholder="Enter email"
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                margin: '8px 0'
              }}
              type="text"
              id="email"
              name="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <div className="mt-4 flex justify-center">
            <button className="rounded-md bg-black px-4 py-2 text-white">Submit</button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
};

export default UserForm;
