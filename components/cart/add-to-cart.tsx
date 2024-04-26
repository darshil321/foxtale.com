'use client';
import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit, FiMinus, FiPlus } from 'react-icons/fi';
import { HiX } from 'react-icons/hi';
import EditItemForm from './edit-item-form';
import Modal from 'react-modal';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { productActions } from 'store/actions/product.actions';

const products = [
  {
    name: 'Overnight Glow Mask',
    option: 'Single',
    mrp: 600,
    price: 595,
    quantity: 2,
    imageSrc: 'https://foxtale.in/cdn/shop/files/PDP---First-Image-16.jpg?v=1712244428&width=240'
  },
  {
    name: 'Hydrating Moisturizer with Ceramide',
    option: 'Single',
    price: 300,
    quantity: 3,
    imageSrc: 'https://foxtale.in/cdn/shop/files/PDP---First-Image-09.jpg?v=1712244190&width=240'
  }
];

const AddToCart: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.products.products);
  console.log('data', data);

  useEffect(() => {
    console.log('attempt product: sagaa', products);
    dispatch(productActions.attemptGetProducts({ first: 10 }));
    console.log('attempt product: sagaa1', products);
  }, [dispatch]);

  return (
    <div className="w-full lg:py-20">
      <div className="grid grid-cols-6 gap-4 py-2 text-sm font-semibold">
        <div className="col-span-3">PRODUCT</div>
        <div className="hidden text-center sm:block">PRICE</div>
        <div className="hidden text-center sm:block">QUANTITY</div>
        <div className="hidden text-center sm:block">TOTAL</div>
      </div>
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
      <hr className="bg-gray-400" />
      {products?.map((product, index) => (
        <>
          <hr />
          <div key={index} className="grid gap-4 py-8 sm:grid-cols-1 lg:grid-cols-6">
            <div className="flex sm:grid-cols-1 lg:col-span-3">
              <div>
                <img
                  src={product.imageSrc}
                  className="object-cover"
                  alt="product"
                  height={120}
                  width={120}
                />
              </div>
              <div className="flex flex-col justify-between py-6 pl-4">
                <p className="cursor-pointer font-medium hover:text-green-500">{product.name}</p>
                <p className="text-sm">
                  <span className="text-gray-500">Option:</span>
                  <span className="font-semibold text-gray-500">{product.option}</span>
                </p>
                <div className="mt-1 flex space-x-2">
                  <FiEdit
                    onClick={() => setModalIsOpen(true)}
                    className="cursor-pointer text-lg text-gray-600"
                  />
                  <FiTrash2 className="cursor-pointer text-lg text-gray-600" />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center text-center text-gray-500">
              {product.mrp && (
                <span className="mr-1 text-black line-through">{'₹' + product.mrp ?? ''}</span>
              )}
              <span className={`${product.mrp ? 'text-red-500' : 'text-black'}`}>
                {'₹' + product.price}
              </span>
            </div>
            <div className="flex items-center justify-center text-center">
              <span className="flex h-10 w-[120px] items-center justify-between rounded-full border border-black px-3">
                <FiMinus className="cursor-pointer text-lg text-black" />
                <span>{product.quantity}</span>
                <FiPlus className="cursor-pointer text-lg text-black" />
              </span>
            </div>
            <div className="flex items-center justify-center text-center font-semibold text-gray-500">
              ₹{product.price * product.quantity}
            </div>
          </div>
        </>
      ))}
      <hr />
    </div>
  );
};

export default AddToCart;
