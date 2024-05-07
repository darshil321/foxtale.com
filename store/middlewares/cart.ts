import { call, put, takeLatest } from 'redux-saga/effects';
import { cartActions } from 'store/actions/cart.action';
import { getCart } from 'store/requests/cart.request';

// fetches all products
export function* getCartSaga(action: {
  type: string;
  payload: {
    cartId: string;
  };
}): Generator<any, void, any> {
  try {
    const { cartId } = action.payload;

    const data = yield call(getCart, { cartId });

    yield put(cartActions.getCartSuccess(data));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}

// export function* addToCartSaga(action: {
//   type: string;
//   payload: {

//   };
// }): Generator<any, void, any> {
//   try {
//     const cartId = cookies
//     const {productId, quantity} = payload

//     if (!cartId) {
//      createCart() //api call for create cart
//     }

//     //fetch cart from redux
//     const cartProduct = store.cart

//     const isProductExist = cartProduct.find(p => p.id === productId)

//     if (isProductExist) {
//       updateCartItemQuantity() //api call for update cart Item
//     } else {
//       addCartItem() //api call for add cart Item
//     }

//   } catch (error) {

//     console.log('error', error)
//   }
// }

export function* cartSagaWatchers() {
  yield takeLatest(cartActions.attemptGetCarts, getCartSaga);
}
