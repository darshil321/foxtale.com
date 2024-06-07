import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/shopify/types';

export default function ProductGridItems({
  products,
  collectionIndex
}: {
  products: Product[];
  collectionIndex?: number;
}) {
  return (
    <>
      {products?.map((product, index) => (
        <Grid.Item key={product.handle} className=" h-full flex-grow">
          <div className="relative inline-block h-full w-full max-w-[200px] flex-grow md:max-w-[270px] ">
            <GridTileImage
              collectionIndex={collectionIndex}
              product={product}
              index={index}
              alt={product.title}
              label={{
                title: product.title,
                description: product.description,
                amount: product.variants[0]?.price.amount ?? '',
                currencyCode: product.priceRange.maxVariantPrice.currencyCode
              }}
              src={product.featuredImage?.url}
            />
          </div>
        </Grid.Item>
      ))}
    </>
  );
}
