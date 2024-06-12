'use client';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import Image from 'next/image';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ResultsTabs({ images }: { images: any[] }) {
  const [categories] = useState([
    {
      id: 1,
      cetegory: 'RESULTS AFTER 10 DAYS',
      contentImage:
        images[0] ||
        'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/10-Day_Sunscreen_SPF_70_01.jpg?v=1685299918'
    },
    {
      id: 2,
      cetegory: 'RESULTS AFTER 30 DAYS',
      contentImage:
        images[2] ||
        'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Matte_Finish_Sunscreen_SPF_70_-04.jpg?v=1685299918'
    }
  ]);

  return (
    <div className="w-full px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex justify-between space-x-3  md:px-2">
          {Object.values(categories).map((result) => (
            <Tab
              key={result.cetegory}
              className={({ selected }) =>
                classNames(
                  'w-full py-2 text-xs font-semibold leading-5 md:px-2 md:text-lg',
                  selected
                    ? 'bg-black text-gray-200 md:bg-transparent md:text-black md:underline md:underline-offset-2 '
                    : ' text-[#878787] hover:text-black'
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
