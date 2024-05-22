import React from 'react';
import Navbar from '../layout/navbar';
import Banner from '../layout/navbar/banner';

const Loader = () => {
  return (
    <div>
      <Banner />
      <div className=" lg:mx-30 max-w-[1440px] md:mx-10 md:px-4 lg:px-5 xl:mx-[121px]">
        <Navbar />
      </div>
    </div>
  );
};

export default Loader;
