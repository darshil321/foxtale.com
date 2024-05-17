import React from 'react';

interface WrapperProps {
  children: React.ReactNode;
}

const WrapperContainer: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className=" lg:mx-30 max-w-[1440px] md:mx-10 md:px-4 lg:px-5 xl:mx-[121px]">
      {children}
    </div>
  );
};

export default WrapperContainer;
