'use client';
import React, { useEffect, useState } from 'react';

const ProductTag = ({ product, show }: any) => {
  const [tagText, setTagText] = useState<string | null>(null);

  useEffect(() => {
    const productTagMetafield = product?.metafields?.find(
      (item: any) => item?.key === 'product_tag'
    );

    if (productTagMetafield) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(productTagMetafield.value, 'text/html');
      const tagContent = doc?.querySelector('.shop-tag')?.textContent?.trim();

      if (tagContent) {
        setTagText(tagContent);
      }
    }
  }, [product]);

  if (!tagText) return null;

  return (
    <>
      {show && (
        <div className="absolute right-2 top-2 rounded-md bg-white p-1 text-xs font-bold uppercase text-orange-400">
          {tagText}
        </div>
      )}
    </>
  );
};

export default ProductTag;
