'use client';
import { Product } from '@/lib/shopify/types';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { trackEvent } from 'utils/mixpanel';
import { sendGAEvent } from '@next/third-parties/google';

export default function Accordion({ product }: { product: Product }) {
  const filteredDataByKey = product?.metafields?.find((item: any) => item?.key === 'faq-section');

  function extractQuestionsAndAnswersFromHTML(html: any) {
    const faqItemsArray: any = [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const faqDiv = doc.querySelector('.faq_item');

    if (faqDiv) {
      const questions = faqDiv.querySelectorAll('h4');
      const answers = faqDiv.querySelectorAll('p');

      questions.forEach((question, index) => {
        const answer = answers[index];
        if (question && answer) {
          faqItemsArray.push({
            question: question.textContent?.trim(),
            answer: answer.textContent?.trim()
          });
        }
      });
    }

    return faqItemsArray;
  }

  const FaqItems = extractQuestionsAndAnswersFromHTML(filteredDataByKey?.value);

  return (
    <div className="w-full px-4 py-8 md:py-16">
      <div className="mx-auto w-full rounded-2xl bg-white">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex h-full w-full  bg-[#f7f7f7] text-sm font-medium text-black hover:bg-[#f7f7f7] focus:outline-none focus-visible:ring-[#f7f7f7]/75 focus-visible:ring-offset-1"
                onClick={() => {
                  sendGAEvent({ event: 'FAQs Clicked', value: { FaqsClicked: 'Clicked' } });
                  trackEvent('FAQs Clicked', {
                    FaqsClicked: 'Clicked'
                  });
                }}
              >
                <div className="flex w-full items-center justify-between p-3 md:p-6">
                  <span className="h-full text-lg font-semibold md:text-2xl">FAQs</span>
                  <ChevronUpIcon
                    className={`${open ? '' : 'rotate-180 transform'} h-10 w-10 text-black`}
                  />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-black">
                {FaqItems.map((item: any, index: number) => (
                  <div className="flex flex-col py-2" key={index}>
                    <h4 className="text-lg font-semibold ">{item.question}</h4>
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
