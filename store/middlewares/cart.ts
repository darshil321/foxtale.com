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
    console.log('kkkkkkk', data);

    yield put(cartActions.getCartSuccess(data));
  } catch (error) {
    console.log('error', error);
    yield put(cartActions.getCartFailed());
  }
}

export function* cartSagaWatchers() {
  yield takeLatest(cartActions.attemptGetCarts, getCartSaga);
}
