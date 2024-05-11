'use client';
import Image from 'next/image';
import React, { useState } from 'react';

interface Offer {
  description: string;
  code: string;
}

const OfferSection: React.FC = () => {
  const [copiedCodes, setCopiedCodes] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCodes((prevState) => ({ ...prevState, [text]: true }));
      setTimeout(() => {
        setCopiedCodes((prevState) => ({ ...prevState, [text]: false }));
      }, 2000);
    });
  };

  const offers: Offer[] = [
    { description: 'BUY 2 @ 799', code: 'FOX799' },
    { description: 'BUY 2 @ 599', code: 'FOX599' },
    { description: 'BUY 2 @ 499', code: 'FOX499' }
  ];

  return (
    <div className="flex flex-col space-y-4 bg-[#fcfcc8] px-4 py-3">
      <div className="flex justify-between pr-8">
        <div className="text-2xl font-semibold">Offers</div>
        <p className="text-[10px] text-gray-500 ">Tap below to copy the coupon code</p>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 pr-2 md:pr-8">
        {offers.map((offer, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center  space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-red-500"
                viewBox="0 0 8 8"
                fill="none"
              >
                <path
                  d="M4 0L4.89806 2.76393H7.80423L5.45308 4.47214L6.35114 7.23607L4 5.52786L1.64886 7.23607L2.54692 4.47214L0.195774 2.76393H3.10194L4 0Z"
                  fill="#D76339"
                />
              </svg>
              <span className="text-sm font-semibold text-[#878787]">{offer.description}</span>
            </div>
            <div className="flex items-center justify-end space-x-2 pr-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="5"
                viewBox="0 0 7 5"
                fill="none"
              >
                <path
                  d="M6.325 0C6.62875 0 6.875 0.279822 6.875 0.625V1.3202C6.875 1.5103 6.78023 1.68295 6.63202 1.7672L6.60683 1.78042C6.36037 1.89917 6.1875 2.17664 6.1875 2.5C6.1875 2.81404 6.35056 3.08481 6.58572 3.20893L6.61317 3.2226C6.77161 3.29681 6.875 3.47232 6.875 3.66707V4.375C6.875 4.72018 6.62875 5 6.325 5H0.550002C0.246245 5 0 4.72018 0 4.375V3.70895C0 3.50554 0.0996801 3.32006 0.256929 3.22658L0.28223 3.2126C0.521174 3.0902 0.687502 2.81717 0.687502 2.5C0.687502 2.19452 0.533212 1.92999 0.308356 1.80155L0.28104 1.78679C0.110038 1.69965 0 1.50653 0 1.29356V0.625C0 0.279822 0.246245 0 0.550002 0L6.325 0ZM6.31979 0.539099H0.555215C0.479276 0.539099 0.417715 0.609055 0.417715 0.695349V1.18235C0.85327 1.42799 1.13671 1.93471 1.13671 2.5C1.13671 3.06523 0.853321 3.57197 0.417715 3.81765V4.30465C0.417715 4.39095 0.479276 4.4609 0.555215 4.4609H6.31979C6.39573 4.4609 6.45729 4.39095 6.45729 4.30465V3.81767C6.02252 3.57255 5.73829 3.06614 5.73829 2.5C5.73829 1.93414 6.02226 1.42763 6.45729 1.18234V0.695349C6.45729 0.609055 6.39573 0.539099 6.31979 0.539099ZM4.95 3.28125C5.17782 3.28125 5.3625 3.49112 5.3625 3.75C5.3625 4.00888 5.17782 4.21875 4.95 4.21875C4.72218 4.21875 4.5375 4.00888 4.5375 3.75C4.5375 3.49112 4.72218 3.28125 4.95 3.28125ZM4.95 2.03125C5.17782 2.03125 5.3625 2.24112 5.3625 2.5C5.3625 2.75888 5.17782 2.96875 4.95 2.96875C4.72218 2.96875 4.5375 2.75888 4.5375 2.5C4.5375 2.24112 4.72218 2.03125 4.95 2.03125ZM4.95 0.78125C5.17782 0.78125 5.3625 0.991117 5.3625 1.25C5.3625 1.50888 5.17782 1.71875 4.95 1.71875C4.72218 1.71875 4.5375 1.50888 4.5375 1.25C4.5375 0.991117 4.72218 0.78125 4.95 0.78125Z"
                  fill="black"
                ></path>
              </svg>
              <span
                className="cursor-pointer text-right text-xs text-primary"
                onClick={() => copyToClipboard(offer.code)}
              >
                CODE: {offer.code}
              </span>
              {copiedCodes[offer.code] && (
                <span className="text-sm text-green-500">Code Copied</span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex w-full flex-row items-center justify-around" style={{ marginTop: 18 }}>
        <div className="col-4">
          <div className="flex h-full w-full flex-col items-center gap-1 object-cover">
            <Image
              width={35}
              height={23}
              alt="image"
              className="offer-section-img"
              src="https://cdn.shopify.com/s/files/1/0654/4329/9583/files/Group_10.png?v=1679030967"
            />
            <span className="line-clamp-2 text-[10px] font-medium">
              EARN REWARDS
              <br />
              ON ALL ORDERS
            </span>
          </div>
        </div>
        <div className="col-4">
          <div className="flex h-full w-full flex-col items-center gap-1 object-cover">
            <Image
              width={35}
              height={23}
              alt="image"
              className="offer-section-img"
              src="https://cdn.shopify.com/s/files/1/0654/4329/9583/files/Group_8.png?v=1679030967"
            />{' '}
            <span className="line-clamp-2 text-[10px] font-medium">
              NO DELIVERY
              <br />
              CHARGES
            </span>
          </div>
        </div>
        <div className="col-4">
          <div className="flex h-full w-full flex-col items-center gap-1 object-cover">
            <Image
              width={25}
              height={25}
              alt="image"
              className="offer-section-img"
              src="https://cdn.shopify.com/s/files/1/0654/4329/9583/files/Group_89.png?v=1679030967"
            />{' '}
            <span className="line-clamp-2 text-[10px] font-medium">
              FREE GIFT ON
              <br />
              ALL ORDERS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;
