'use client';
import { useAppDispatch } from '@/store/hooks';
import { setReviewFormOpen } from '@/store/slices/product-slice';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getReviewsById } from '@/lib/shopify';
import Pagination from './pagination';

// Function to calculate the number of months between two dates
const calculateMonthsAgo = (date: string) => {
  const now = new Date();
  const reviewDate = new Date(date);
  const yearsDifference = now.getFullYear() - reviewDate.getFullYear();
  const monthsDifference = now.getMonth() - reviewDate.getMonth();
  const totalMonths = yearsDifference * 12 + monthsDifference;
  return totalMonths;
};

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
}

const ReviewComponent: React.FC<{ product: Product }> = ({ product }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Set your page size
  const [totalReviews, setTotalReviews] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewsById(product.id, page, pageSize);
        setReviews(response?.data);
        setTotalReviews(response?.total);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [product.id, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(totalReviews / pageSize));
  console.log('totalPages', totalPages);

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
          <p>No reviews available.</p>
        )}
      </div>
      <Pagination currentPage={page} totalPages={10} onPageChange={handlePageChange} />
    </div>
  );
};

export default ReviewComponent;
