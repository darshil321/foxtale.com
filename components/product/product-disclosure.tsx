'use client';

import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { Product } from '@/lib/shopify/types';

export default function ProductDisclosure({ product }: { product: Product }) {
  const filteredDataByKey = product?.metafields?.find((item: any) => item?.key === 'unique');
  console.log('product.title', product.title);
  const parser = new DOMParser();
  console.log('filter', filteredDataByKey?.value);
  const htmlDocument = parser.parseFromString(filteredDataByKey?.value, 'text/html');

  const disclosureItems = [] as {
    image: string | null;
    title: string | null;
    contentImage: string | null;
    contentHtml: string | null;
  }[];

  const styleElement = htmlDocument?.querySelector('style');
  const styleContent = styleElement ? styleElement.innerHTML : '';

  const dropdownElements = htmlDocument?.querySelectorAll('.unique-section-dropdown');

  dropdownElements?.forEach((dropdownElement) => {
    const imgElement = dropdownElement?.querySelector('.unique-section-dropdown-img');
    const titleElement = dropdownElement?.querySelector('.unique-section-dropdown-title');

    if (imgElement && titleElement) {
      const image = imgElement?.getAttribute('src');
      const title = titleElement?.textContent?.trim() || null;

      console.log('dropdownElement', dropdownElement);

      const extraImgElement = dropdownElement.querySelector('.dropdown-content-img');
      let contentImage = null;
      let contentHtml = null;

      if (extraImgElement) {
        console.log('extraImgElement', extraImgElement);

        if (extraImgElement.tagName === 'DIV') {
          contentHtml = extraImgElement.innerHTML;
        } else {
          const imgElement =
            window.innerWidth > 500
              ? dropdownElement.querySelector('.dek_img_slide')
              : dropdownElement.querySelector('.mb_img_slide');

          const dekImgSlideClass = extraImgElement.classList.contains('dek_img_slide');
          const mbImgSlideClass = extraImgElement.classList.contains('mb_img_slide');
          console.log('dekImgSlideClass', dekImgSlideClass, 'mbImgSlideClass', mbImgSlideClass);

          if (dekImgSlideClass && imgElement) {
            contentImage = imgElement.querySelector('img')?.getAttribute('src') || null;
          } else {
            contentImage = extraImgElement.getAttribute('src') || null;
          }
        }
      }

      disclosureItems?.push({ image, title, contentImage, contentHtml });
    }
  });

  console.log('disclosureItems', disclosureItems);

  return (
    <>
      {styleContent && <style dangerouslySetInnerHTML={{ __html: styleContent }} />}
      {disclosureItems && disclosureItems?.length ? (
        <div className="w-full px-0 py-4 md:px-0 md:py-10">
          <h2 className="ml-4 text-[21px] font-semibold leading-8 md:ml-0  md:text-2xl">
            All About Our {product.title}
          </h2>
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
                            quality={100}
                            className="h-24 w-24 object-contain"
                          />
                          <div className="flex w-full items-center justify-between px-6">
                            <span className="h-full text-start text-[18px] font-semibold leading-5 md:text-lg">
                              {item.title}
                            </span>
                            <ChevronUpIcon
                              className={`${open ? '' : 'rotate-180 transform'} h-10 min-h-10 w-8 min-w-8 text-black`}
                            />
                          </div>
                        </div>
                      </Disclosure.Button>

                      <Disclosure.Panel className="flex justify-center pb-2 pt-4 text-sm text-gray-500">
                        {item.contentHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: item.contentHtml }} />
                        ) : (
                          <Image
                            src={item?.contentImage || item?.image || '/Images/defualt.png'}
                            alt={item?.title || 'image'}
                            width={500}
                            height={500}
                            loading="lazy"
                            quality={100}
                            className="h-full w-full max-w-[500px] object-cover"
                          />
                        )}
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
