import React from 'react';

interface WrapperProps {
  children: React.ReactNode;
}

const WrapperContainer: React.FC<WrapperProps> = ({ children }) => {
  return <div className="mx-[121px] bg-neutral-50 px-5">{children}</div>;
};

export default WrapperContainer;
