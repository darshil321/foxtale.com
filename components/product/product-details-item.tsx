import { ShopifyProduct } from 'lib/shopify/types';
import Image from 'next/image';

const ProductDetailsItem = ({ product }: { product: ShopifyProduct }) => {
  console.log('produc222t', product);
  return (
    <div className="flex w-full max-w-sm flex-row items-center justify-start ">
      <div className="h-full w-max object-cover">
        <Image
          src={product.featuredImage.url || '/Images/defualt.png'}
          className=" h-16 w-16 object-cover"
          alt="Foxtale"
          width={100}
          height={100}
        />
      </div>
      <div className="ml-3">
        <h1 className="text-sm font-semibold leading-7 ">{product.title}</h1>
      </div>
    </div>
  );
};

export default ProductDetailsItem;
