'use client';
import { getProductId } from '@/lib/helper/helper';
import { createReview } from '@/lib/shopify';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';
import React, { useState } from 'react';
import ReactModal from 'react-modal';
import ReactStars from 'react-rating-stars-component';

// import { GokwikButton } from 'components/elements/gokwik-button';

const ReviewForm = ({ product }: { product: Product }) => {
  const handleFileChange = () => {};

  const handleButtonClick = () => {
    document.getElementById('file')?.click();
  };
  const [review, setReview] = useState({
    media: '',
    body: '',
    heading: '',
    rating: 0,
    external_product_id: getProductId(product.id)
  });

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // Handle form submission
  //   console.log('Submitted file:', file);
  // };
  const ratingChanged = (newRating: number) => {
    setReview({ ...review, rating: newRating });
  };

  return (
    <ReactModal
      shouldReturnFocusAfterClose={false}
      shouldFocusAfterRender={false}
      className=" mx-auto my-auto mt-[130px] w-1/3 rounded-md  bg-white font-poppins  shadow-lg  "
      isOpen={false}
    >
      <div className="relative flex items-center justify-end rounded-md p-4 text-black transition-colors ">
        <Image src={'/Images/close.svg'} alt={'close'} width={25} height={25} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createReview(review);
        }}
      >
        <h1 className="  text-center text-2xl">Write a Review</h1>
        <div className="p-8 text-gray-500">
          <div className="grid grid-cols-3">
            <p>Product:</p>
            <p className="col-span-2 text-black">{product.title}</p>
          </div>
          <div className="mt-2 grid grid-cols-3 items-center">
            <label htmlFor="rating">Rating:</label>
            <div className="col-span-2 flex items-center">
              <ReactStars
                className=" space-x-4"
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#000000"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-center">
            <label htmlFor="name">Summary:</label>
            <input
              className=" col-span-2"
              placeholder="I dig it!"
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                margin: '8px 0'
              }}
              type="text"
              id="name"
              name="name"
              onChange={(e) => setReview({ ...review, heading: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label htmlFor="more-info">More Info:</label>

            <input
              className="col-span-2"
              placeholder="What did you like it about?"
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                margin: '8px 0'
              }}
              type="text"
              id="more-info"
              name="more-info"
              onChange={(e) => setReview({ ...review, body: e.target.value })}
            />
          </div>
          <div className="mt-2 flex justify-center rounded-md border border-dashed border-gray-400 bg-[#F2F2FF]">
            <input
              className="hidden"
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
            />
            <Image
              className="pl-4 pr-2"
              src="/images/import.svg"
              alt="upload"
              width={60}
              height={60}
            />

            <button
              type="button"
              className="rounded  py-6 text-center text-black"
              onClick={handleButtonClick}
            >
              Click here to upload photos and/or videos
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <button className="rounded-md bg-black px-4 py-2 text-white">Submit</button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
};

export default ReviewForm;
