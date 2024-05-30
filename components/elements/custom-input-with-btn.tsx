'use client';
import axios from 'axios';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { Slide, toast } from 'react-toastify';

interface CustomInputWithBtnProps {
  res: any;
}

const ToastContent: React.FC<CustomInputWithBtnProps> = ({ res }: { res: any }) => {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <img height={20} width={20} src="/Images/tick.svg" alt="" />
        <span className="ml-2 text-black">{res?.data?.message}</span>
      </div>
    </div>
  );
};

const CustomInputBtn = ({
  className,
  buttonText,
  text,
  type
}: {
  className?: string;
  buttonText?: string;
  text?: string;
  type?: 'email' | 'password' | 'text';
}) => {
  const notify = (res: any) =>
    toast(<ToastContent res={res} />, {
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: true,
      transition: Slide
    });

  const emailRef = useRef<HTMLInputElement>(null);

  const handleNewsletterSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current) {
      alert('Please enter a valid email address');
      return;
    }
    try {
      await axios
        .post('/api/subscribe', {
          email: emailRef.current.value
        })
        .then((res: any) => {
          if (res.status === 200) {
            notify(res);
          }
        });
    } catch (error) {}
  };
  return (
    <form onSubmit={handleNewsletterSubscription}>
      <div className="flex flex-row gap-2 ">
        <div className="relative mt-2 flex w-full items-center">
          {/* <span className="absolute">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="dark mx-3 h-6 w-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </span> */}

          <input
            type={type}
            placeholder={text}
            className={clsx(
              'border-white-400 block w-full rounded-[4px]  border bg-white py-[16px] pl-5 pr-5  placeholder-black  focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 rtl:pl-5 rtl:pr-11',
              className
            )}
            ref={emailRef}
          />
          <button
            type="submit"
            onClick={handleNewsletterSubscription as React.EventHandler<React.SyntheticEvent>}
            className="absolute right-1.5 rounded-[4px]  bg-black px-5 py-3 text-[12px] tracking-widest text-white"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CustomInputBtn;
