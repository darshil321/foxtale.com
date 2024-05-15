import clsx from 'clsx';
import Image from 'next/image';

export default function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors ">
      <Image
        src={'/Images/close.svg'}
        alt={'close'}
        width={25}
        height={25}
        className={clsx('h-6 transition-all ease-in-out hover:scale-110 ', className)}
      />
    </div>
  );
}
