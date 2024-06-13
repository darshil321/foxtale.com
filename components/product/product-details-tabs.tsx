'use client';
import { Tab } from '@headlessui/react';
import Image from 'next/image';
import { Product } from '@/lib/shopify/types';

type Category = {
  id: number;
  category: string;
  contentType: 'text' | 'image';
  contentImage: string | null;
  contentImageMobile: string | null;
  contentText?: { title?: string; content?: string }[];
};

type Props = {
  product: Product;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetailsTabs({ product }: Props) {
  const filteredDataByKey = product?.metafields?.find(
    (item: any) => item?.key === 'combo_overview'
  );
  const parser = new DOMParser();

  const htmlDocument = parser.parseFromString(filteredDataByKey?.value, 'text/html');
  const parseHTML = (doc: Document): Category[] => {
    const categories: Category[] = [];

    const tabButtons = doc?.querySelectorAll('.tablinks');
    tabButtons?.forEach((button: any, index: number) => {
      const category = button?.textContent?.trim();
      const contentContainer = doc.getElementById(
        button.getAttribute('onclick').match(/(?<=\")(.*?)(?=\")/g)[0]
      ) as any;
      const contentImage = contentContainer?.querySelector('img')?.getAttribute('src');
      const contentImageMobile = contentContainer
        ?.querySelector('.mb_img_slide img')
        ?.getAttribute('src');

      let contentType: 'text' | 'image' = 'text';

      if (contentImage) {
        contentType = 'image';
      }

      const categoryData: Category = {
        id: index + 1,
        category,
        contentType,
        contentImage,
        contentImageMobile
      };
      categories.push(categoryData);
    });

    const tabContents = doc.querySelectorAll('.tabcontent');
    tabContents.forEach((content, index) => {
      const textBlocks = content.querySelectorAll('.combo-hero-ingredients p');
      const contentText = Array.from(textBlocks)?.map((block: any) => ({
        title: block?.previousElementSibling?.textContent?.trim(),
        content: block?.textContent?.trim()
      }));

      if (categories[index]) {
        (categories[index] as any).contentText = contentText || [];
      }
    });

    return categories;
  };

  const categories: Category[] = parseHTML(htmlDocument);

  return (
    <div className="w-full px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex justify-between gap-[2px] p-1  ">
          {categories?.map((result) => (
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
          {categories?.map((post, idx) => (
            <Tab.Panel key={idx} className={classNames(' bg-white p-3')}>
              {post.contentType === 'image' ? (
                <div className="h-full w-full">
                  <Image
                    src={
                      post?.contentImageMobile ||
                      'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Starlet-05.jpg'
                    }
                    alt={post.category}
                    className="object-cover md:hidden"
                    height={470}
                    width={382}
                  />

                  <Image
                    src={post?.contentImage || ''}
                    alt={post.category}
                    height={500}
                    width={500}
                    loading="lazy"
                    quality={100}
                    className="hidden h-full w-full object-cover md:block"
                  />
                </div>
              ) : (
                <div className="px-4  md:px-8">
                  {post?.contentText?.map((text) => (
                    <div className="my-2 py-1 md:mb-3" key={text.title}>
                      <h2 className="text-base font-semibold ">{text.title}</h2>
                      <p className="text-sm text-[#58595b]">{text.content}</p>
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
