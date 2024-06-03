import React from 'react';

const ProductCombo: React.FC = () => {
  return (
    <div className="bg-white text-black">
      <div className="hidden md:block">
        {/* Desktop version */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8">
          <div>
            <img
              src="path/to/your/blue-serum-image.jpg"
              alt="Anti Aging Retinol Serum"
              className="h-80"
            />
            <p className="mb-2 mt-6 text-xl font-semibold">Anti Aging Retinol Serum</p>
            <p className="mb-4 text-sm">
              Enriched with Encapsulated Retinol that seeps deep into the skin, preserves its
              youthful radiance, protects against signs of ageing, and causes zero purging.
            </p>
            <button className="bg-black px-4 py-2 text-white">ADD TO CART</button>
          </div>
          <div>
            <img
              src="path/to/your/pink-drops-image.jpg"
              alt="Rapid Spot Reduction Drops"
              className="h-80"
            />
            <p className="mb-2 mt-6 text-xl font-semibold">Rapid Spot Reduction Drops</p>
            <p className="mb-4 text-sm">
              Packed with Tranexamic Acid, this serum fades dark spots & patches. It reduces
              hyperpigmentation, brightens & evens out skin tone & regulates melanin synthesis.
            </p>
            <button className="bg-black px-4 py-2 text-white">ADD TO CART</button>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        {/* Mobile version */}
        <div className="mx-auto max-w-md px-4 py-8">
          <img
            src="path/to/your/blue-serum-image.jpg"
            alt="Anti Aging Retinol Serum"
            className="w-full"
          />
          <p className="mt-4 text-lg font-semibold">Anti Aging Retinol Serum</p>
          <p className="text-sm">
            Enriched with Encapsulated Retinol that seeps deep into the skin, preserves its youthful
            radiance, protects against signs of ageing, and causes zero purging.
          </p>
          <button className="my-4 w-full bg-black py-2 text-white">ADD TO CART</button>

          <img
            src="path/to/your/pink-drops-image.jpg"
            alt="Rapid Spot Reduction Drops"
            className="w-full"
          />
          <p className="mt-4 text-lg font-semibold">Rapid Spot Reduction Drops</p>
          <p className="text-sm">
            Packed with Tranexamic Acid, this serum fades dark spots & patches. It reduces
            hyperpigmentation, brightens & evens out skin tone & regulates melanin synthesis.
          </p>
          <button className="my-4 w-full bg-black py-2 text-white">ADD TO CART</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCombo;
