import { all, fork } from 'redux-saga/effects';
import { productsSagaWatchers } from '../middlewares/products';

function* rootSaga() {
  yield all([fork(productsSagaWatchers)]);
}

export default rootSaga;
