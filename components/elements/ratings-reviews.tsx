'use client';
import { useAppDispatch } from '@/store/hooks';
import { setReviewFormOpen } from '@/store/slices/product-slice';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getReviewsById } from '@/lib/shopify';
import Pagination from './pagination';
import { useSelector } from 'react-redux';

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
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else if (diffInDays <= 28) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
    } else if (diffInDays <= 31) {
      return '1 month ago';
    } else {
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths <= 12) {
        return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
      } else {
        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
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
  const [pageSize] = useState(15); // Set your page size
  const [totalReviews, setTotalReviews] = useState(product?.reviewsCount || 0);
  const productCollections = useSelector((state: any) => state.collections.collectionsProducts);
  const [ratings, setRatings] = useState<any>(null);

  useEffect(() => {
    if (!product || product?.ratings) return;
    const _prod = productCollections?.find((p: any) => p.id === product.id);

    if (_prod && _prod?.ratings) setRatings(_prod.ratings);
  }, [product, productCollections]);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const average = ratings?.average || 0;

  // Helper function to get star type
  const getStarType = (index: number, average: number) => {
    const diff = average - index;
    if (diff >= 1) {
      return 'full';
    } else if (diff >= 0.75) {
      return 'three-quarters';
    } else if (diff >= 0.5) {
      return 'half';
    } else if (diff >= 0.25) {
      return 'quarter';
    } else {
      return 'empty';
    }
  };
  return (
    <div id="Reviews" className="mx-auto w-full px-4 py-8">
      <div className="flex w-full flex-col justify-between pb-4 md:flex-row md:pb-8">
        <div className="mb-4 flex flex-row items-center justify-between md:flex-col md:items-start">
          <h2 className=" text-start text-[16px] font-medium md:justify-start md:text-3xl md:font-semibold">
            Reviews
          </h2>
          <button
            onClick={() => dispatch(setReviewFormOpen(true))}
            className="font-md   max-w-xs rounded  text-xs  text-blue-600 underline underline-offset-2 md:w-[231px] md:bg-black md:py-[10px] md:text-sm md:text-black md:text-white md:no-underline"
          >
            Write a review
          </button>
        </div>
        <div className="mb-6 flex items-center">
          <span className="text-[40px] font-light md:text-6xl">{average.toFixed(1)}</span>
          <div className="flex flex-col">
            <div className="ml-2 flex text-black">
              {Array(5)
                .fill(0)
                .map((_, i) => {
                  const starType = getStarType(i, average);

                  return (
                    <span className={`star text-2xl  ${starType}`} key={i}>
                      ★
                    </span>
                  );
                })}
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
                  <div className="flex justify-between ">
                    <div className="flex items-center text-black">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                        ))}
                    </div>
                    <span className="text-sm uppercase text-gray-500">
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
                          width={105}
                          height={105}
                          key={index}
                          src={mediaItem.url}
                          alt={`media-${index}`}
                          className="h-24 w-24 rounded-lg"
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

const styles = `
  .star {
    position: relative;
    display: inline-block;
    color: #ccc; /* Base color for empty part */
  }
  .star.full {
    color: black; /* Full star color */
  }
  .star.three-quarters::before,
  .star.half::before,
  .star.quarter::before {
    content: '★';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    overflow: hidden;
  }
  .star.three-quarters::before {
    width: 75%;
    color: black; /* Three-quarters star color */
  }
  .star.half::before {
    width: 50%;
    color: black; /* Half star color */
  }
  .star.quarter::before {
    width: 25%;
    color: black; /* Quarter star color */
  }
`;

// Add CSS to the document head
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
