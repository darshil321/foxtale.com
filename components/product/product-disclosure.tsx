'use client';

import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { Product } from '@/lib/shopify/types';

export default function ProductDisclosure({ product }: { product: Product }) {
  const filteredDataByKey = product?.metafields?.find((item: any) => item?.key === 'unique');
  const parser = new DOMParser();
  const htmlDocument = parser.parseFromString(filteredDataByKey?.value, 'text/html');

  const disclosureItems = [] as {
    image: string | null;
    title: string | null;
    contentImage: string | null;
  }[];

  const dropdownElements = htmlDocument?.querySelectorAll('.unique-section-dropdown');

  dropdownElements?.forEach((dropdownElement) => {
    const imgElement = dropdownElement?.querySelector('.unique-section-dropdown-img');
    const titleElement = dropdownElement?.querySelector('.unique-section-dropdown-title');

    if (imgElement && titleElement) {
      const image = imgElement?.getAttribute('src');
      const title = titleElement?.textContent?.trim() || null;

      const extraImgElement = dropdownElement.querySelector('.dropdown-content-img');
      let contentImage = null;
      if (extraImgElement) {
        const dekImgSlideClass = extraImgElement.classList.contains('dek_img_slide');

        if (dekImgSlideClass) {
          contentImage = extraImgElement.querySelector('img')?.getAttribute('src') || null;
        } else {
          contentImage = extraImgElement.getAttribute('src') || null;
        }
      }

      disclosureItems?.push({ image, title, contentImage });
    }
  });

  return (
    <>
      {disclosureItems && disclosureItems?.length ? (
        <div className="w-full px-0 py-3 md:px-0 md:py-10">
          <h2 className="ml-4 text-2xl font-semibold">What makes this unique?</h2>
          <div className="w-full pt-2">
            <div className="mx-auto w-full gap-4 space-y-4">
              {disclosureItems?.map((item, index) => (
                <Disclosure key={index}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex h-full w-full bg-[#f7f7f7] text-sm font-medium text-black hover:bg-[#f7f7f7] focus:outline-none focus-visible:ring-[#f7f7f7]/75 focus-visible:ring-offset-1">
                        <div className="flex h-full w-full items-center justify-between">
                          <Image
                            src={item?.image || '/Images/defualt.png'}
                            alt={item?.title || 'image'}
                            width={500}
                            height={500}
                            loading="lazy"
                            quality={80}
                            className="h-24 w-24 object-cover"
                          />
                          <div className="flex w-full items-center justify-between px-6">
                            <span className="h-full text-sm font-semibold md:text-lg">
                              {item.title}
                            </span>
                            <ChevronUpIcon
                              className={`${open ? '' : 'rotate-180 transform'} h-10 w-10 text-black`}
                            />
                          </div>
                        </div>
                      </Disclosure.Button>

                      <Disclosure.Panel className="flex justify-center px-4 pb-2 pt-4 text-sm text-gray-500">
                        <Image
                          src={item?.contentImage || item?.image || '/Images/defualt.png'}
                          alt={item?.title || 'image'}
                          width={500}
                          height={500}
                          loading="lazy"
                          quality={80}
                          className="h-full w-full max-w-[500px] object-cover"
                        />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
