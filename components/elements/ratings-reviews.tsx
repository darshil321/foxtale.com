'use client';
import { useAppDispatch } from '@/store/hooks';
import { setReviewFormOpen } from '@/store/slices/product-slice';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getReviewsById } from '@/lib/shopify';
import Pagination from './pagination';

// Function to calculate the number of months between two dates
function timeAgo(date: Date): string {
  const now = new Date();

  const stripTime = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const today = stripTime(now);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);

  const strippedDate = stripTime(date);

  if (strippedDate.getTime() === today.getTime()) {
    return 'today';
  } else if (strippedDate.getTime() === yesterday.getTime()) {
    return 'yesterday';
  } else if (strippedDate.getTime() === dayBeforeYesterday.getTime()) {
    return '2 days ago';
  } else {
    const diffInMilliseconds = today.getTime() - strippedDate.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays <= 6) {
      return `${diffInDays} days ago`;
    } else if (diffInDays <= 28) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} weeks ago`;
    } else if (diffInDays <= 31) {
      return '1 month ago';
    } else {
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths <= 12) {
        return `${diffInMonths} months ago`;
      } else {
        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} years ago`;
      }
    }
  }
}

interface Review {
  id: string;
  customer: {
    avatar_url: string;
    generated_display_name: string;
    generated_display_location: string;
  };
  created_at: string;
  rating: number;
  body: string;
  reviewText: string;
}

interface Product {
  id: string;
  ratings: {
    average: number;
  };
  reviewsCount: number;
}

const ReviewComponent: React.FC<{ product: Product }> = ({ product }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Set your page size
  const [totalReviews, setTotalReviews] = useState(product?.reviewsCount || 0);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewsById(product.id, page, pageSize);
        setReviews(
          response?.data
          // .filter(
          //   (reviews: any) => reviews.heading && reviews.customer.generated_display_name
          // )
        );
        setTotalReviews(response?.total);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [product.id, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(totalReviews / pageSize));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="mx-auto w-full px-4 py-8">
      <div className="flex w-full flex-col justify-between pb-4 md:flex-row md:pb-8">
        <div className="flex flex-row justify-between md:flex-col">
          <h2 className="mb-4 text-2xl font-semibold md:text-3xl">Reviews</h2>
          <button
            onClick={() => dispatch(setReviewFormOpen(true))}
            className="mb-6 max-w-xs rounded px-4 py-2 text-xs text-blue-500 underline underline-offset-2 md:w-[231px] md:bg-black md:text-sm md:text-black md:text-white md:no-underline"
          >
            Write a review
          </button>
        </div>
        <div className="mb-6 flex items-center">
          <span className="text-6xl font-normal">{product.ratings.average}</span>
          <div className="flex flex-col">
            <div className="ml-2 text-yellow-500">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span key={i}>{i < product.ratings.average ? '★' : '☆'}</span>
                ))}
            </div>
            <span className="ml-2 text-xs text-gray-600">{totalReviews} REVIEWS</span>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        {reviews.length > 0 ? (
          reviews.map((review: any) => {
            return (
              <div
                key={review.id}
                className="flex flex-col space-y-2 border-b pb-4 md:flex-row md:space-x-4"
              >
                <div className="flex flex-shrink-0 flex-row md:w-[250px]">
                  <Image
                    width={48}
                    height={48}
                    src={review.customer.avatar_url}
                    alt={`${review.customer.generated_display_name}`}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex flex-col pl-2">
                    <h3 className="text-base font-semibold underline">
                      {review.customer.generated_display_name}
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      {review.customer.generated_display_location}
                    </p>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center text-black">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                        ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {timeAgo(new Date(review.created_at))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold">{review.heading}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">{review.body || review.reviewText}</p>
                  {review.media && review.media.length > 0 && (
                    <div className="mt-2 flex space-x-2">
                      {review.media.map((mediaItem: any, index: any) => (
                        <Image
                          width={100}
                          height={100}
                          key={index}
                          src={mediaItem.url}
                          alt={`media-${index}`}
                          className="h-16 w-16 rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default ReviewComponent;
