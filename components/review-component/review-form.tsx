'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import ReactModal from 'react-modal';
import ReactStars from 'react-rating-stars-component';

// import { GokwikButton } from 'components/elements/gokwik-button';

const ReviewForm = ({}: {}) => {
  const [file, setFile] = useState(null);
  console.log(file);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    document.getElementById('file').click();
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // Handle form submission
  //   console.log('Submitted file:', file);
  // };
  const ratingChanged = (newRating: number) => {
    console.log(newRating);
  };
  return (
    <ReactModal
      shouldReturnFocusAfterClose={false}
      shouldFocusAfterRender={false}
      className=" mx-auto my-auto mt-[130px] w-1/3 rounded-md  bg-white font-poppins  shadow-lg  "
      isOpen={true}
    >
      <form onSubmit={() => {}}>
        <h1 className="mt-6 pt-6 text-center text-2xl">Write a Review</h1>
        <div className="p-8 text-gray-500">
          <div className="grid grid-cols-3">
            <p>Product:</p>
            <p className="col-span-2 text-black">Rapid Spot Reduction Drops</p>
          </div>
          <div className=" mt-2 grid grid-cols-3 items-center">
            <label htmlFor="name">Rating:</label>
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
              className="col-span-2"
              placeholder="Enter your name"
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                margin: '8px 0'
              }}
              type="text"
              id="name"
              name="name"
              onChange={(e) => console.log(e)}
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label htmlFor="name">More Info:</label>

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
              id="name"
              name="name"
              onChange={(e) => console.log(e)}
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
            <Image className="mr-2" src="/images/import.svg" alt="upload" width={40} height={40} />

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
