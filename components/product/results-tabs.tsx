'use client';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import Image from 'next/image';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ResultsTabs() {
  const [categories] = useState([
    {
      id: 1,
      cetegory: 'RESULTS AFTER 10 DAYS',
      contentImage:
        'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Matte_Finish_Sunscreen_SPF_70_-13.jpg?v=1685299918'
    },
    {
      id: 2,
      cetegory: 'RESULTS AFTER 30 DAYS',
      contentImage:
        'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Matte_Finish_Sunscreen_SPF_70_-04.jpg?v=1685299918'
    }
  ]);

  return (
    <div className="w-full px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex justify-between p-1 ">
          {Object.values(categories).map((result) => (
            <Tab
              key={result.cetegory}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-lg font-medium leading-5',
                  selected ? 'text-gray-700 underline underline-offset-2' : ' hover:text-black'
                )
              }
            >
              {result.cetegory}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((post, idx) => (
            <Tab.Panel key={idx} className={classNames(' bg-white p-3')}>
              <Image
                src={post.contentImage}
                alt={post.cetegory}
                height={540}
                width={270}
                className=" h-full w-full  object-cover"
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
