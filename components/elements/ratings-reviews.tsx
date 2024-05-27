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
      <div className="flex w-full  flex-col justify-between pb-4 md:flex-row md:pb-8">
        <div className="flex flex-row justify-between  md:flex-col">
          <h2 className="mb-4 text-2xl font-semibold md:text-3xl">Reviews</h2>
          <button className="mb-6 max-w-xs   rounded px-4 py-2  text-xs text-blue-500  underline underline-offset-2 md:w-[231px] md:bg-black md:text-sm md:text-black md:text-white md:no-underline">
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
          reviews.map((review: any) => (
            <div key={review.id} className="flex space-x-4 border-b pb-4">
              <div className="flex-shrink-0">
                <Image
                  width={48}
                  height={48}
                  src={review.customer.avatar_url}
                  alt={`${review.customer.generated_display_name}`}
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {review.customer.generated_display_name}
                    </h3>
                    <p className="text-sm text-gray-500">{review.heading}</p>
                    <p className="text-gray-500">{review.customer.generated_display_location}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {calculateMonthsAgo(review.created_at)} months ago
                  </span>
                </div>
                <div className="mt-2 flex items-center text-yellow-500">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                    ))}
                </div>
                <p className="mt-2 text-gray-700">{review.body || review.reviewText}</p>
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
                alt={`${reviews.customer.generated_display_name}`}
                className="h-12 w-12 rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center  md:justify-between">
                <div className="flex w-full flex-col md:flex-row md:space-x-8 md:pr-6">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {reviews.customer.generated_display_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {reviews.customer.generated_display_location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{reviews.heading}</p>
                    <div className="mt-2 flex items-center text-yellow-500">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i}>{i < reviews.rating ? '★' : '☆'}</span>
                        ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {calculateMonthsAgo(reviews.created_at)} months ago
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
