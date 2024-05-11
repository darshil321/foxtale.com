'use client';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

const FaqItems = [
  {
    question: 'When should you use the Niacinamide Serum?',
    answer:
      'Our Niacinamide, like its name, is truly a game changer. You can use it any time you want oil-free radiance and matte skin. It instantly blurs pores, hydrates your skin, and gives you a primer-like finish.'
  },
  {
    question: 'What are the benefits of using the Niacinamide Serum?',
    answer:
      'Our Niacinamide, like its name, is truly a game changer. You can use it any time you want oil-free radiance and matte skin. It instantly blurs pores, hydrates your skin, and gives you a primer-like finish.'
  },
  {
    question: 'What are the benefits of using the Niacinamide Serum?',
    answer:
      ' You can use this Niacinamide Serum daily - in the morning and evening, or whenever you require a touch-up. Take a pea-sized amount of the serum, evenly spread it on your face, and gently pat onto a cleansed face. '
  },
  {
    question: 'What are the benefits of using the Niacinamide Serum?',
    answer: 'We ship orders within 24 hours of purchase. Please check our FAQ for more details. '
  },
  {
    question: 'What are the benefits of using the Niacinamide Serum?',
    answer: '4. For which skin type does the Niacinamide Serum work best?'
  }
];

export default function Accordion() {
  return (
    <div className="w-full px-4 py-8 md:py-16">
      <div className="mx-auto w-full rounded-2xl bg-white p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex h-full w-full  bg-[#f7f7f7] text-sm font-medium text-black hover:bg-[#f7f7f7] focus:outline-none focus-visible:ring-[#f7f7f7]/75 focus-visible:ring-offset-1">
                <div className="flex w-full items-center justify-between p-3 md:p-6">
                  <span className="h-full text-lg font-semibold md:text-2xl">FAQs</span>
                  <ChevronUpIcon
                    className={`${open ? '' : 'rotate-180 transform'} h-10 w-10 text-black`}
                  />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-black">
                {FaqItems.map((item, index) => (
                  <div className="flex flex-col py-2" key={index}>
                    <h4 className="text-lg font-semibold ">
                      {index + 1}. {item.question}
                    </h4>
                    <p className="text-sm font-normal">{item.answer}</p>
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
