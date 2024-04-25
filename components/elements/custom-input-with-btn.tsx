import clsx from 'clsx';
import React from 'react';

const CustomInputBtn = ({
  className,
  buttonText,
  text,
  type
}: {
  className?: string;
  buttonText?: string;
  text?: string;
  onClick?: () => void;
  type?: 'email' | 'password' | 'text';
}) => {
  return (
    <div className="flex flex-row gap-2 ">
      <div className="relative mt-2 flex w-full items-center">
        <span className="absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="dark mx-3 h-6 w-6 "
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </span>

        <input
          type={type}
          placeholder={text}
          className={clsx(
            'block w-full rounded-[4px] border  border-gray-400 bg-white py-[16px] pl-11 pr-5  placeholder-black  focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 rtl:pl-5 rtl:pr-11',
            className
          )}
        />
        <button className="absolute right-1.5 rounded-[4px]  bg-black px-5 py-3 text-[12px] tracking-widest text-white">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CustomInputBtn;
