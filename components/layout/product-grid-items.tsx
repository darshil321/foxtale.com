import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/shopify/types';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <div className="relative inline-block h-full w-full max-w-[270px]">
            <GridTileImage
              product={product}
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode
              }}
              src={product.featuredImage?.url}
              sizes="(min-width: 768px) 33vw, (min-width: 340px) 50vw, 100vw"
            />
          </div>
        </Grid.Item>
      ))}
    </>
  );
}
