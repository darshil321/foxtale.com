'use client';
import { createCustomer, createReview } from '@/lib/shopify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProductReviews, setSuccessModal, setUserFormOpen } from '@/store/slices/product-slice';
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
  const [loading, setLoading] = useState(false);
  return (
    <ReactModal
      style={{
        overlay: {
          zIndex: 9999,
          boxShadow: '0px 3px 20px rgba(0, 0, 0, 0.2)',
          backgroundColor: 'rgba(186, 186, 186, 0.5)'
        }
      }}
      shouldReturnFocusAfterClose={false}
      shouldFocusAfterRender={false}
      className=" mx-auto my-auto mt-[130px] w-[380] rounded-md bg-white  font-poppins shadow-md  md:w-[420px]  "
      isOpen={isUserFormOpen}
    >
      <div
        onClick={() => {
          dispatch(setUserFormOpen(false));
        }}
        className="relative flex cursor-pointer items-center justify-end rounded-md p-2 text-black transition-colors "
      >
        <Image src={'/Images/close.svg'} alt={'close'} width={25} height={25} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('firsdddt');
          setLoading(true);
          createCustomer(user).then((res) => {
            const feraUser = {
              id: res.id,
              name: res.name,
              email: res.email
            };
            const reviewObject = getLastElement(productReviews);
            const review = { ...reviewObject, customer: feraUser };
            createReview(review).then((res) => {
              setLoading(false);
              dispatch(setProductReviews({ ...review, id: res.id }));
            });
            console.log('firsw22t');

            dispatch(setFeraUser(feraUser));
            console.log('first');
            dispatch(setUserFormOpen(false));
            dispatch(setSuccessModal(true));
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
            <button
              disabled={loading}
              aria-disabled={loading}
              className={`flex rounded-md bg-black px-4 py-2 text-white  ${loading ? 'cursor-not-allowed' : ''}`}
            >
              Submit
              {loading && (
                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white md:h-5 md:w-5"></div>
              )}
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
};

export default UserForm;
