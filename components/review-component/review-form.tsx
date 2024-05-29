'use client';
import { getProductId } from '@/lib/helper/helper';
import { createReview, updateReview, uploadMedia } from '@/lib/shopify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setProductReviews,
  setReviewFormOpen,
  setSuccessModal,
  setUserFormOpen
} from '@/store/slices/product-slice';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import ReactStars from 'react-rating-stars-component';

const ReviewForm = ({ product }: { product: Product }) => {
  const [file, setFile] = useState('');

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileChange({ target: { files: [droppedFile] } });
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFile(file.name);

    const formData = new FormData();
    formData.append('file', file);

    uploadMedia(formData).then((res) => {
      setReview({ ...review, media: res.url });
    });
  };

  const isReviewFormOpen = useAppSelector((state) => state.products.isReviewFormOpen);

  const handleButtonClick = () => {
    document.getElementById('file')?.click();
  };

  const [review, setReview] = useState({
    body: '',
    heading: '',
    rating: 3,
    external_product_id: getProductId(product.id),
    customer_id: '',
    media: ''
  });

  const ratingChanged = (newRating: number) => {
    setReview({ ...review, rating: newRating });
  };

  const getReviewId = (productId: string, productReviews: any[]): string | null => {
    const review = productReviews?.find((r) => r.external_product_id === productId);
    return review ? review.id : null;
  };

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const feraUser = useAppSelector((state) => state.user.feraUser);
  const productReviews = useAppSelector((state) => state.products.productReviews);

  const ratingToSummaryMap: { [key: string]: string } = {
    '1': 'No thanks.',
    '2': 'Nah.',
    '3': 'Pretty ok.',
    '4': 'I dig it!',
    '5': 'Fantastic!'
  };

  useEffect(() => {
    setReview({
      ...review,
      heading: ratingToSummaryMap[review.rating as keyof typeof ratingToSummaryMap] ?? ''
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review.rating]);

  const labelStyles = {
    color: '#6C757D',
    fontWeight: 500,
    marginBottom: '8px'
  };

  const headingStyles = {
    fontSize: '25px',
    fontWeight: 300,
    marginTop: 0,
    color: 'black',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

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
      className="mx-auto my-auto mt-[130px] w-[380px] rounded-md bg-white font-poppins shadow-md md:w-[420px]"
      isOpen={isReviewFormOpen}
    >
      <div
        onClick={() => {
          dispatch(setReviewFormOpen(false));
        }}
        className="relative flex cursor-pointer items-center justify-end rounded-md p-2 text-black transition-colors"
      >
        <Image src={'/Images/close.svg'} alt={'close'} width={25} height={25} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(setProductReviews(review));
          if (!feraUser) {
            dispatch(setReviewFormOpen(false));
            dispatch(setUserFormOpen(true));
            return;
          }

          const id = getReviewId(getProductId(product.id), productReviews);
          setLoading(true);
          if (!id) {
            createReview({ ...review, customer: feraUser }).then((res) => {
              setLoading(false);
              dispatch(setProductReviews({ ...review, id: res.id }));
              dispatch(setReviewFormOpen(false));
              dispatch(setSuccessModal(true));
            });
          } else {
            updateReview({ ...review, customer_id: feraUser.id }, id).then((res) => {
              setLoading(false);
              dispatch(setProductReviews({ ...review, id: res.id }));
              dispatch(setReviewFormOpen(false));
              dispatch(setSuccessModal(true));
            });
          }
        }}
      >
        <h1 style={headingStyles} className="text-center text-2xl">
          Write a Review
        </h1>
        <div className="p-8 text-gray-500">
          <div className="grid grid-cols-3">
            <label style={labelStyles} htmlFor="rating">
              Product:
            </label>
            <p className="col-span-2 text-black">{product.title}</p>
          </div>
          <div className="mt-2 grid grid-cols-3 items-center">
            <label style={labelStyles} htmlFor="rating">
              Rating:
            </label>
            <div className="col-span-2 flex items-center">
              <ReactStars
                value={review.rating}
                className="space-x-4"
                onChange={ratingChanged}
                size={24}
                activeColor="#000000"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-center">
            <label style={labelStyles} htmlFor="name">
              Summary:
            </label>
            <input
              className="col-span-2"
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                margin: '8px 0'
              }}
              value={review.heading}
              type="text"
              id="name"
              name="name"
              onChange={(e) => setReview({ ...review, heading: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 items-center">
            <label style={labelStyles} htmlFor="more-info">
              More Info:
            </label>
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
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="mt-2 flex justify-center rounded-md border border-dashed border-gray-400 bg-[#F2F2FF]"
          >
            <input
              className="hidden"
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
            />
            <Image
              className="pl-4 pr-2"
              src="/Images/import.svg"
              alt="upload"
              width={60}
              height={60}
            />
            <button
              type="button"
              className="rounded py-6 text-center text-black"
              onClick={handleButtonClick}
            >
              {!file && 'Drag and drop or click here to upload photos and/or videos'}
              {file && file}
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              disabled={loading}
              aria-disabled={loading}
              className={`mt-4 flex rounded-md bg-black px-4 py-2 text-white ${loading ? 'cursor-not-allowed' : ''}`}
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

export default ReviewForm;
