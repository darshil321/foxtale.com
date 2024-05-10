import { addItem, removeItem, updateItemQuantity } from '@/components/cart/actions';
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

export function* addToCartSaga(action: {
  type: string;
  payload: { selectedVariantId: string; product: any; tempId: string };
}): Generator<any, void, any> {
  try {
    const { selectedVariantId, tempId } = action.payload;
    const data = yield call({ fn: addItem, context: null }, null, selectedVariantId);

    yield put(cartActions.setCart({ ...data, tempId }));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}
export function* updateCartSaga(action: {
  type: string;
  payload: { lineId: string; variantId: string; quantity: number };
}): Generator<any, void, any> {
  try {
    const { payload } = action;
    const data = yield call({ fn: updateItemQuantity, context: null }, null, payload);

    yield put(cartActions.setCart(data));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}
export function* removeCartSaga(action: {
  type: string;
  payload: { lineId: string };
}): Generator<any, void, any> {
  try {
    console.log('newRm1', action);
    const {
      payload: { lineId }
    } = action;

    const data = yield call({ fn: removeItem, context: null }, null, lineId);
    console.log('newRm2', data, action);

    yield put(cartActions.setCart(data));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}

export function* cartSagaWatchers() {
  yield takeLatest(cartActions.attemptGetCarts, getCartSaga);
  yield takeLatest(cartActions.addToCart, addToCartSaga);
  yield takeLatest(cartActions.updateCart, updateCartSaga);
  yield takeLatest(cartActions.removeCart, removeCartSaga);
}
