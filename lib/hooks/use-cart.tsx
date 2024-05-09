import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { CartItem } from '../shopify/types';

export function useCart() {
  const cart = useAppSelector((state) => state.cart.cart); // fetch cart

  const { totalAmount, totalQuantity } = useMemo(() => {
    const totalCost = cart?.lines.reduce((acc: number, line: CartItem) => {
      const lineTotalAmount = Number(line.cost.totalAmount.amount);
      return acc + lineTotalAmount;
    }, 0);
    const cartTotalQuantity = cart?.lines.reduce((acc: number, line: CartItem) => {
      const lineQuantity =
        Number(line?.cost?.totalAmount?.amount) === 0 ? 0 : Number(line.quantity);
      return acc + lineQuantity;
    }, 0);

    const cartTotalAmount = totalCost?.toFixed(2);

    return {
      totalAmount: cartTotalAmount,
      totalQuantity: cartTotalQuantity
    };
  }, [cart]);

  return { totalAmount, totalQuantity };
}

// Example usage of useCart inside a function component:
// function MyComponent() {
//   const { cartTotalAmount, cartTotalQuantity } = useCart();
//
//   // Your component logic using cartTotalAmount and cartTotalQuantity
//
//   return (
//     // JSX for your component
//   );
// }
