import { put, takeLatest } from 'redux-saga/effects';
import { productActions } from '../actions/product.actions';

// fetches all products
export function* getProductsSaga(payload: any): Generator<any, void, any> {
  try {
    console.log('attempt product: saga', payload);
    //api no call
    const res = { ...payload, id: '123' };
    // const data = yield call(getAllProducts);

    yield put(productActions.getProductSuccess(res));
  } catch (error) {
    console.log('error', error);
    // yield put(getProductsError(error));
  }
}

export function* productsSagaWatchers() {
  yield takeLatest(productActions.attemptGetProducts, getProductsSaga);
}
