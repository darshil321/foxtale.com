/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import clsx from 'clsx';
import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options?.length || (options?.length === 1 && options[0]?.values?.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return;
  }

  const findVariantForOptionValue = (optionValue: string) => {
    return variants.find((variant) =>
      variant.selectedOptions.some((option) => option.value === optionValue)
    );
  };

  // Refs for the last option and the Combos button
  const lastOptionRef = useRef(null) as any;
  const combosRef = useRef(null) as any;
  const textStripRef = useRef(null) as any;

  function updateTextStripPosition() {
    if (lastOptionRef.current && combosRef?.current && textStripRef?.current) {
      const leftBoundary = lastOptionRef?.current?.getBoundingClientRect()?.left;
      const rightBoundary = combosRef?.current?.getBoundingClientRect()?.right;

      const parentLeft = lastOptionRef?.current?.parentNode?.getBoundingClientRect().left;

      const textStrip = textStripRef?.current;
      textStrip.style.left = `${leftBoundary - parentLeft}px`;
      textStrip.style.width = `${rightBoundary - leftBoundary}px`;
    }
  }

  useEffect(() => {
    // Update position when the component mounts
    updateTextStripPosition();

    // Setup event listener for window resize
    const handleResize = () => {
      updateTextStripPosition();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [options, variants]);

  return (
    <div className="relative overflow-hidden">
      {options.map((option, index) => {
        const isColorOption = option.name.toLowerCase() === 'color';
        const isLastOption = index === options.length - 1;

        return (
          <dl className=" mb-6" key={option.id}>
            <dd
              className={clsx('relative flex w-full ', {
                ' divide-x divide-black border border-black': !isColorOption
              })}
            >
              {option.values.map((value) => {
                const optionNameLowerCase = option.name.toLowerCase();
                const optionSearchParams = new URLSearchParams(searchParams.toString());
                optionSearchParams.set(optionNameLowerCase, value);
                const optionUrl = createUrl(pathname, optionSearchParams);
                const selectedVariant = findVariantForOptionValue(value);
                const isAvailableForSale = selectedVariant?.availableForSale;
                const isActive = searchParams.get(optionNameLowerCase) === value;

                return (
                  <button
                    key={value}
                    aria-disabled={!isAvailableForSale}
                    disabled={!isAvailableForSale}
                    onClick={() => {
                      if (isAvailableForSale) {
                        router.replace(optionUrl, { scroll: false });
                      }
                    }}
                    title={`${option.name} ${value}${isAvailableForSale ? ' (Out of Stock)' : ''}`}
                    className={clsx(
                      'flex flex-1 cursor-pointer flex-col items-center justify-center gap-0 py-3 text-sm uppercase tracking-wider text-gray-700 md:text-base',
                      {
                        'cursor-default bg-gray-600 bg-opacity-30 font-medium text-black': isActive,
                        'border-1 cursor-default border-black': isActive && isColorOption,
                        'ring-1 ring-transparent transition duration-200 ease-in-out hover:text-black':
                          !isActive && isAvailableForSale,
                        'relative z-10 cursor-not-allowed overflow-hidden text-black ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform':
                          !isAvailableForSale,
                        'mr-2 h-full max-h-8 w-full max-w-[1.5rem] rounded-full border bg-yellow-500':
                          isColorOption,
                        [`bg-${value.toLowerCase()}`]: isColorOption && isAvailableForSale,
                        'bg-gray-300': isColorOption && !isAvailableForSale
                      }
                    )}
                    ref={isLastOption ? lastOptionRef : null}
                  >
                    {!isColorOption && value}
                    {!isColorOption && (
                      <span className="text-xs">₹{selectedVariant?.price.amount}</span>
                    )}
                  </button>
                );
              })}
              {!isColorOption && (
                <Link
                  href={'#combos'}
                  className={clsx(
                    'relative flex flex-1 items-center justify-center scroll-smooth bg-neutral-100 py-4 text-sm uppercase tracking-wider text-stone-700 hover:text-black md:text-base '
                  )}
                  ref={combosRef}
                >
                  Combos
                </Link>
              )}
            </dd>
          </dl>
        );
      })}
      {/* Text strip */}
      <div
        ref={textStripRef}
        className="absolute bottom-6 bg-green-500 text-center text-[7px] text-white md:text-[10px]"
        style={{ left: 0, width: '100%' }} // This will be overridden by useEffect logic
      >
        Save Extra
      </div>
    </div>
  );
}
