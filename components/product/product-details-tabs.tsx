'use client';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import Image from 'next/image';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetailsTabs() {
  const [categories] = useState([
    {
      id: 1,
      category: 'usage details',
      contentType: 'image',
      contentImage:
        'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Single_Product_Website_Design-17_2_1_1_1_1.jpg?v=1679991078',
      contentImageMobile:
        'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Daily_Hydrating_Serum-07.jpg?v=1683804229'
    },
    {
      id: 3,
      category: 'Hero ingredients',
      contentType: 'text',
      contentText: [
        {
          title: 'MATTE FINISH SUNSCREEN SPF 70',
          content:
            'Acts as a carrier system that releases and activates the retinol molecule in deeper layers of your skin. It’s capable of altering the behaviour of aged cells, improving collagen production to modify skin texture, boosting radiance, and treating the signs of ageing 2X faster compared to other Retinol serums.'
        },
        {
          title: 'MATTE FINISH SUNSCREEN SPF 70',
          content:
            'We ship orders within 24 hours of purchase. Please check our FAQ for more details.'
        },
        {
          title: 'MATTE FINISH SUNSCREEN SPF 70',
          content:
            'We ship orders within 24 hours of purchase. Please check our FAQ for more details.'
        },
        {
          title: 'MATTE FINISH SUNSCREEN SPF 70',
          content:
            'We ship orders within 24 hours of purchase. Please check our FAQ for more details.'
        }
      ]
    },
    {
      id: 2,
      category: 'Good to know',
      contentType: 'image',
      contentImage:
        'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Matte_Finish_Sunscreen_SPF_70_-04.jpg?v=1685299918',
      contentImageMobile:
        'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Daily_Hydrating_Serum-15.jpg?v=1683804229'
    }
  ]);

  return (
    <div className="w-full px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex justify-between gap-1 p-1  ">
          {categories.map((result) => (
            <Tab
              key={result.category}
              className={({ selected }) =>
                classNames(
                  'w-full text-wrap border border-black px-1 py-2 text-xs  font-medium leading-5 hover:bg-black hover:text-white md:py-4 md:text-base',
                  selected ? 'bg-black text-base text-white ' : ' '
                )
              }
            >
              {result.category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {categories.map((post, idx) => (
            <Tab.Panel key={idx} className={classNames(' bg-white p-3')}>
              {post.contentType === 'image' ? (
                <div className="h-full w-full">
                  <Image
                    src={post?.contentImageMobile || ''}
                    alt={post.category}
                    className="object-cover md:hidden"
                    height={470}
                    width={382}
                  />

                  <Image
                    src={post?.contentImage || ''}
                    alt={post.category}
                    height={540}
                    width={570}
                    className="hidden h-full w-full object-cover md:block"
                  />
                </div>
              ) : (
                <div className="px-4  md:px-8">
                  {post?.contentText?.map((text) => (
                    <div className="my-2 py-1 md:mb-3" key={text.title}>
                      <h2 className="text-base font-semibold uppercase ">{text.title}</h2>
                      <p className="text-sm">{text.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
