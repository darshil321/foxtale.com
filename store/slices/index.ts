import { all, fork } from 'redux-saga/effects';
import { productsSagaWatchers } from '../middlewares/products';
import { cartSagaWatchers } from 'store/middlewares/cart';

function* rootSaga() {
  yield all([fork(productsSagaWatchers), fork(cartSagaWatchers)]);
}

export default rootSaga;
