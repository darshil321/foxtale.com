'use client';
import Image from 'next/image';
import React from 'react';

// Function to calculate the number of months between two dates
const calculateMonthsAgo = (date: any) => {
  const now = new Date();
  const reviewDate = new Date(date);
  const yearsDifference = now.getFullYear() - reviewDate.getFullYear();
  const monthsDifference = now.getMonth() - reviewDate.getMonth();
  const totalMonths = yearsDifference * 12 + monthsDifference;
  return totalMonths;
};

const ReviewComponent = ({ reviews }: { reviews: any }) => {
  console.log('reviews', reviews);

  return (
    <div className="mx-auto w-full px-4 py-8">
      <div className="flex w-full flex-row justify-between pb-8">
        <div className="flex flex-col">
          <h2 className="mb-4 text-3xl font-bold">Reviews</h2>
          <button className="mb-6 w-[231px] max-w-xs rounded bg-black px-4 py-2 text-sm text-white">
            Write a review
          </button>
        </div>

        <div className="mb-6 flex items-center">
          <span className="text-6xl font-normal">{reviews.product.rating.average}</span>
          <div className="flex flex-col">
            <div className="ml-2 text-yellow-500">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span key={i}>{i < 4 ? '★' : '☆'}</span>
                ))}
            </div>
            <span className="ml-2 text-xs text-gray-600">445 REVIEWS</span>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="flex space-x-4 border-b pb-4">
              <div className="flex-shrink-0">
                <Image
                  width={48}
                  height={48}
                  src={review.customer.avatar_url}
                  alt={`${review.name}`}
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {review.customer.generated_display_location}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {calculateMonthsAgo(review.customer.created_at)} months ago
                  </span>
                </div>
                <p className="text-gray-500">{review.location}</p>
                <div className="mt-2 flex items-center text-yellow-500">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                    ))}
                </div>
                <h4 className="mt-2 text-lg font-bold">{review.body}</h4>
                <p className="mt-1 text-gray-700">{review.reviewText}</p>
              </div>
            </div>
          ))
        ) : (
          <div key={reviews.id} className="flex space-x-4 border-b pb-4">
            <div className="flex-shrink-0">
              <Image
                width={48}
                height={48}
                src={reviews.customer.avatar_url}
                alt={`${reviews.name}`}
                className="h-12 w-12 rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {reviews.customer.generated_display_location}
                </h3>
                <span className="text-sm text-gray-500">
                  {calculateMonthsAgo(reviews.customer.created_at)} months ago
                </span>
              </div>
              <p className="text-gray-500">{reviews.location}</p>
              <div className="mt-2 flex items-center text-yellow-500">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i}>{i < reviews.rating ? '★' : '☆'}</span>
                  ))}
              </div>
              <h4 className="mt-2 text-lg font-bold">{reviews.body}</h4>
              <p className="mt-1 text-gray-700">{reviews.reviewText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
