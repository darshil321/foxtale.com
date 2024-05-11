import React from 'react';

const Banner = () => {
  const dynamicValue = 'FOX1099';
  const staticPart = '[ Code: ';
  const closingBracket = ' ]';

  const result = staticPart + dynamicValue + closingBracket;
  return (
    <div>
      <div className="bg-black bg-gradient-to-r text-white ">
        <div className="container mx-auto flex items-center justify-center py-1">
          <div className="text-white">
            <span className="text-sm font-semibold text-white">Buy 2 @ 799 &nbsp;</span>
            <a href="#" rel="noopener noreferrer" className="text-sm">
              {result}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
