'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { trackEvent } from 'utils/mixpanel';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  const handleLogoClick = () => {
    // sendGAEvent({ event: 'logo clickerd', value: {} });
    trackEvent('Logo Clicked', {});
  };
  return (
    <div
      className={clsx('flex flex-none items-center justify-center border-neutral-200 bg-white ', {
        'h-[40px] w-full rounded-xl': !size,
        'h-[40px] w-full rounded-lg': size === 'sm'
      })}
    >
      <Image
        onClick={handleLogoClick}
        src={'/foxtalelogo.avif'}
        className={clsx({
          'h-[36px] w-full': !size,
          'h-[30px] w-full': size === 'sm'
        })}
        alt={'Foxtale'}
        width={96}
        height={32}
      />
    </div>
  );
}
