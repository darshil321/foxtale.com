'use client';

import clsx from 'clsx';
import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// type Combination = {
//   id: string;
//   availableForSale: boolean;
//   [key: string]: string | boolean;
// };

export function VariantSelector({
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

  return options.map((option) => (
    <dl className="mb-6" key={option.id}>
      <dt className="mb-2 text-sm uppercase tracking-wide">{option.name}</dt>
      <dd className="flex w-max flex-wrap divide-x  divide-black border border-black ">
        {option.values.map((value) => {
          const optionNameLowerCase = option.name.toLowerCase();

          // Base option params on current params so we can preserve any other param state in the url.
          const optionSearchParams = new URLSearchParams(searchParams.toString());

          // Update the option params using the current option to reflect how the url *would* change,
          // if the option was clicked.
          optionSearchParams.set(optionNameLowerCase, value);
          const optionUrl = createUrl(pathname, optionSearchParams);

          // Find the corresponding variant for the selected options
          const selectedVariant = findVariantForOptionValue(value);

          // Determine if the variant is available for sale
          const isAvailableForSale = selectedVariant?.availableForSale;

          // The option is active if it's in the url params.
          const isActive = searchParams.get(optionNameLowerCase) === value;

          return (
            <button
              key={value}
              aria-disabled={!isAvailableForSale}
              disabled={!isAvailableForSale}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
              title={`${option.name} ${value}${isAvailableForSale ? ' (Out of Stock)' : ''}`}
              className={clsx(
                'flex min-w-[48px] flex-col items-center justify-center gap-0 bg-neutral-100 px-12 py-4 text-base uppercase tracking-wider text-gray-700 ',
                {
                  'cursor-default bg-[#a7a5a5] bg-opacity-40 font-medium text-black': isActive,
                  'ring-1 ring-transparent transition duration-200 ease-in-out hover:text-black':
                    !isActive && isAvailableForSale,
                  'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-black ring-1 ring-neutral-300 before:absolute before:inset-x-0  before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform ':
                    !isAvailableForSale
                }
              )}
            >
              {value}
              <span>₹{selectedVariant?.price.amount}</span>
            </button>
          );
        })}
        <Link
          href={'#combos'}
          className={clsx(
            'flex min-w-[48px] items-center  justify-center  bg-neutral-100 px-6 py-4 text-base uppercase tracking-wider text-stone-700 hover:text-black '
          )}
        >
          Combos
        </Link>
      </dd>
    </dl>
  ));
}
