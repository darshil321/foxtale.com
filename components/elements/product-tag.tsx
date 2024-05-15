'use client';
import React from 'react';

const ProductTag = ({ product }: any) => {
  const productTagMetafield = product?.metafields?.find((item: any) => item?.key === 'product_tag');

  if (!productTagMetafield) return null;

  const parser = new DOMParser();
  const doc = parser.parseFromString(productTagMetafield.value, 'text/html');
  const tagText = doc?.querySelector('.shop-tag')?.textContent?.trim();

  return (
    <>
      {tagText && (
        <div className="absolute right-2 top-2 rounded-md bg-white p-1 text-xs font-bold uppercase text-orange-400">
          {tagText}
        </div>
      )}
    </>
  );
};

export default ProductTag;
