import { GridTileImage } from 'components/grid/tile';
import { getProduct } from 'lib/shopify';
import type { Product } from 'lib/shopify/types';
import Link from 'next/link';

async function BestSellingCombosItem({ priority, handle }: { priority?: boolean; handle: string }) {
  const item = await getProduct(handle);
  if (!item) return;
  return (
    <div className="">
      <Link className="relative block h-full w-full" href={`/product/${item.handle}`}>
        <GridTileImage
          product={item}
          src={item.featuredImage.url}
          priority={priority}
          images={item.images}
          alt={item.title}
          label={{
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode
          }}
        />
      </Link>
    </div>
  );
}

export async function BestSellingCombos({ product }: { product: Product }) {
  const filteredDataByKey = product?.metafields?.find(
    (item: any) => item?.key === 'pair_best_with'
  );
  const products = filteredDataByKey?.value?.split('@');
  return (
    <section id="combos" className="grid grid-cols-2 gap-4 px-4 pb-4">
      <h2 className="col-span-2 gap-3 text-center text-2xl font-medium leading-7">
        Best Selling Combos
      </h2>
      {products?.map((item: string, index: number) => (
        <BestSellingCombosItem key={index} handle={item} />
      ))}
    </section>
  );
}
