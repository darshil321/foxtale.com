import Image from 'next/image';

const ProductDetailsItem = () => {
  return (
    <div className="flex w-full max-w-sm flex-row items-center justify-start ">
      <div className="h-full w-max object-cover">
        <Image
          src={
            'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/Matte_Finish_Sunscreen_SPF_70_-02.jpg?v=1685299918'
          }
          className=" h-16 w-16 object-cover"
          alt="Foxtale"
          width={100}
          height={100}
        />
      </div>
      <div className="ml-3">
        <h1 className="text-sm font-semibold leading-7 ">Niacinamide Serum</h1>
      </div>
    </div>
  );
};

export default ProductDetailsItem;
