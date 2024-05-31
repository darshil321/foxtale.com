'use client';
import clsx from 'clsx';
import { trackEvent } from 'utils/mixpanel';
import { sendGAEvent } from '@next/third-parties/google';

export default function OpenCart({
  className,
  quantity
}: {
  className?: string;
  quantity?: number;
}) {
  const handleOpenCart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    sendGAEvent({ event: 'Cart Button Clicked', value: {} });
    trackEvent('Cart Button Clicked', {});
  };

  return (
    <div
      onClick={handleOpenCart}
      className="relative flex h-11 w-11 items-center justify-center rounded-md  text-black transition-colors "
    >
      {/* <ShoppingCartIcon
        className={clsx('h-7 transition-all ease-in-out hover:scale-110 ', className)}
      /> */}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={clsx('h-7 transition-all ease-in-out hover:scale-110 ', className)}
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>

      {quantity ? (
        <div className="absolute right-2 top-2 -mr-2 -mt-2 h-4 w-4 rounded-full bg-orange-600 text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
