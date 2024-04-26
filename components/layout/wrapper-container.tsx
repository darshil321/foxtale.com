import React from 'react';

interface WrapperProps {
  children: React.ReactNode;
}

const WrapperContainer: React.FC<WrapperProps> = ({ children }) => {
  return <div className=" md:px-4 lg:mx-[121px] lg:px-5">{children}</div>;
};

export default WrapperContainer;
