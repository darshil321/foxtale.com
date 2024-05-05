import { call, put, takeLatest } from 'redux-saga/effects';
import { productActions } from '../actions/product.actions';
import { createCart, getCart } from 'store/requests/cart.request';

// fetches all products
export function* getProductsSagaCart(action: {
  type: string;
  payload: {
    first: number;
  };
}): Generator<any, void, any> {
  try {
    const { first } = action.payload;

    const data = yield call(getCart, { cartId: first });

    yield put(productActions.getProductSuccess(data));
  } catch (error) {
    console.log('error', error);
    yield put(productActions.getProductFailed());
  }
}
export function* createCartSaga(action: {
  type: string;
  payload: {
    lines: any;
  };
}): Generator<any, void, any> {
  try {
    const { lines } = action.payload;

    const data = yield call(createCart, { lines });

    yield put(productActions.getProductSuccess(data));
  } catch (error) {
    console.log('error', error);
    yield put(productActions.getProductFailed());
  }
}

export function* productsSagaWatchers() {
  yield takeLatest(productActions.attemptGetProducts, getProductsSagaCart);
}
