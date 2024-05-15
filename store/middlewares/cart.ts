import { addItem, removeItem, updateItemQuantity } from '@/components/cart/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { cartActions } from 'store/actions/cart.action';
import {
  setAddToCartLoading,
  setRemoveCartLoading,
  setUpdateCartLoading
} from '../slices/cart-slice';
import { getCart } from '@/lib/shopify';

// fetches all products
export function* getCartSaga(action: {
  type: string;
  payload: {
    cartId: string;
  };
}): Generator<any, void, any> {
  try {
    const { cartId } = action.payload;

    console.log('setting cart', action);
    const data = yield call({ fn: getCart, context: null }, cartId);
    console.log('getcart data setting', data);

    yield put(cartActions.setCart(data));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}

export function* addToCartSaga(action: {
  type: string;
  payload: { selectedVariantId: string; product: any; tempId: string };
}): Generator<any, void, any> {
  try {
    yield put(setAddToCartLoading(true));

    const { selectedVariantId, tempId } = action.payload;
    console.log('selectedVariantId', selectedVariantId, tempId);

    const data = yield call({ fn: addItem, context: null }, selectedVariantId);
    yield put(setAddToCartLoading(false));

    yield put(cartActions.setCart(data));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}

export function* updateCartSaga(action: {
  type: string;
  payload: { id: string; merchandiseId: string; quantity: number }[];
}): Generator<any, void, any> {
  try {
    yield put(setUpdateCartLoading(true));
    const { payload } = action;

    yield call({ fn: updateItemQuantity, context: null }, payload);

    yield put(setUpdateCartLoading(false));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}
export function* removeCartSaga(action: {
  type: string;
  payload: { lineIds: string[] };
}): Generator<any, void, any> {
  try {
    const {
      payload: { lineIds }
    } = action;
    yield put(setRemoveCartLoading(true));

    yield call({ fn: removeItem, context: null }, lineIds);

    yield put(setRemoveCartLoading(false));
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
