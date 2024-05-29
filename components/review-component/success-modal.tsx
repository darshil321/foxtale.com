'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSuccessModal } from '@/store/slices/product-slice';
import React from 'react';
import ReactModal from 'react-modal';
import Image from 'next/image';

// import { GokwikButton } from 'components/elements/gokwik-button';

const SuccessModal = () => {
  const dispatch = useAppDispatch();
  const isSuccessModal = useAppSelector((state) => state.products.isSuccessModalOpen);
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
      isOpen={isSuccessModal}
    >
      <div
        onClick={() => {
          dispatch(setSuccessModal(false));
        }}
        className="relative flex cursor-pointer items-center justify-end rounded-md p-2 text-black transition-colors "
      >
        <Image src={'/Images/close.svg'} alt={'close'} width={25} height={25} />
      </div>
      <div className="text-center text-2xl font-light">You're the best!</div>
      <div className="pt-4 text-center text-lg font-light text-black">
        Thanks for taking the time to give us some feedback.
      </div>

      <div className="mt-4 flex justify-center p-6">
        <button
          onClick={() => dispatch(setSuccessModal(false))}
          className="rounded-md bg-black px-4 py-2  text-white"
        >
          Close Window
        </button>
      </div>
    </ReactModal>
  );
};

export default SuccessModal;
