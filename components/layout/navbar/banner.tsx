import React from 'react';

const Banner = () => {
  const dynamicValue = 'FOX1099';
  const staticPart = '[ Code: ';
  const closingBracket = ' ]';

  const result = staticPart + dynamicValue + closingBracket;

  return (
    <div className="container mx-auto flex items-center justify-center bg-black bg-gradient-to-r py-1 text-white">
      <span className="text-sm font-semibold">Buy 2 @ 799 &nbsp;</span>
      <a href="#" rel="noopener noreferrer" className="text-sm">
        {result}
      </a>
    </div>
  );
};

export default Banner;
