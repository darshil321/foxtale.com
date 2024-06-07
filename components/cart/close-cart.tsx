import clsx from 'clsx';
import Image from 'next/image';

export default function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-full w-11 items-center justify-center text-black ">
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
