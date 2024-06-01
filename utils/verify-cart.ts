import { CartLine } from '@shopify/hydrogen-react/storefront-api-types';

export function verifyCart(lines1: CartLine[], lines2: CartLine[]) {
  const merchandiseMap = new Map();

  for (const { merchandise, quantity } of lines1) {
    const key = `${merchandise.id}-${quantity}`;
    merchandiseMap.set(key, true);
  }

  for (const { merchandise, quantity } of lines2) {
    const key = `${merchandise.id}-${quantity}`;
    if (merchandiseMap.has(key)) {
      console.log(`'${merchandise.id}'  exists in both arrays.`);
    } else {
      console.log(`m ID '${merchandise.id}' quannttt ${quantity} doesntt exist in both arrays.`);
      return false;
    }
  }
  return true;
}
