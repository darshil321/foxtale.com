import { addItem, removeItem, updateItemQuantity } from '@/components/cart/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { cartActions } from 'store/actions/cart.action';
import { getCart } from 'store/requests/cart.request';
import { setCartLoading } from '../slices/cart-slice';

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
    const data = yield call({ fn: addItem, context: null }, selectedVariantId);
    yield put(cartActions.setCart({ ...data, tempId }));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}

export function* updateCartSaga(action: {
  type: string;
  payload: { id: string; merchandiseId: string; quantity: number }[];
}): Generator<any, void, any> {
  try {
    yield put(setCartLoading(true));
    const { payload } = action;
    const data = yield call({ fn: updateItemQuantity, context: null }, payload);

    yield put(setCartLoading(false));
    yield put(cartActions.setCart({ data, fromSaga: true }));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}
export function* removeCartSaga(action: {
  type: string;
  payload: { lineId: string };
}): Generator<any, void, any> {
  try {
    const {
      payload: { lineId }
    } = action;

    const data = yield call({ fn: removeItem, context: null }, lineId);

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
