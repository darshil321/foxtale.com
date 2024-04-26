'use client';

import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

const disclosureItems = [
  {
    image:
      'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Enhances_skin_tone.jpg?v=1686677215',

    title: 'What is your refund policy?',
    content:
      "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    contentImage:
      'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Hyperpigmentation-01.jpg?v=1686677215'
  },
  {
    image:
      'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Fades_dark_spots___patches.jpg?v=1686677215',
    title: 'What are your shipping policies?',
    content: 'We ship orders within 24 hours of purchase. Please check our FAQ for more details.',
    contentImage:
      'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Hyperpigmentation-10.jpg?v=1686677215'
  },
  {
    image:
      'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Safe_for_skin_conditions.jpg?v=1686677215',
    title: 'What are your shipping policies?',
    content: 'We ship orders within 24 hours of purchase. Please check our FAQ for more details.',
    contentImage:
      'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Hyperpigmentation-10.jpg?v=1686677215'
  }
];

export default function ProductDisclosure() {
  return (
    <div className="w-full px-4 py-3 md:px-0  md:py-10">
      <h2 className=" text-2xl font-semibold ">What makes this unique?</h2>
      <div className="w-full pt-2">
        <div className="mx-auto w-full gap-4 space-y-4">
          {disclosureItems.map((item, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex h-full w-full  bg-[#f7f7f7] text-sm font-medium text-black hover:bg-[#f7f7f7] focus:outline-none focus-visible:ring-[#f7f7f7]/75 focus-visible:ring-offset-1">
                    <div className="flex h-full w-full items-center justify-between">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={500}
                        height={500}
                        className=" h-24 w-24  object-cover"
                      />
                      <div className="flex w-full items-center justify-between px-6">
                        <span className="h-full text-sm font-semibold md:text-lg">
                          {item.title}
                        </span>
                        <ChevronUpIcon
                          className={`${open ? 'rotate-180 transform' : ''} h-10 w-10 text-black`}
                        />
                      </div>
                    </div>
                  </Disclosure.Button>

                  <Disclosure.Panel className="flex justify-center px-4 pb-2 pt-4 text-sm  text-gray-500">
                    <Image
                      src={item.contentImage}
                      alt={item.title}
                      width={500}
                      height={500}
                      className=" h-full w-full max-w-[500px] object-cover"
                    />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
}
