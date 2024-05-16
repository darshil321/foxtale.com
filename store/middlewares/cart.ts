import { addItems, createCartIfNotExists } from '@/components/cart/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { cartActions } from 'store/actions/cart.action';
import { setRecommendedProduct } from '../slices/cart-slice';
import { getCart, getProductRecommendations } from '@/lib/shopify';
import { getDefaultVariant } from '@/lib/helper/helper';
import { setLoading } from '../slices/cart-slice';

// fetches all products
export function* getCartSaga(action: {
  type: string;
  payload: {
    cartId: string;
  };
}): Generator<any, void, any> {
  try {
    const { cartId } = action.payload;

    const data = yield call({ fn: getCart, context: null }, cartId);

    yield put(cartActions.setCart(data));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}
export function* getRecommendedProductsSaga(action: {
  type: string;
  payload: {
    productId: string;
  };
}): Generator<any, void, any> {
  try {
    const { productId } = action.payload;

    const data = yield call({ fn: getProductRecommendations, context: null }, productId);

    const res = data && data.map((p: any) => ({ product: p, variantId: getDefaultVariant(p).id }));

    yield put(setRecommendedProduct(res));
  } catch (error) {
    console.log('error', error);
  }
}

export function* addToCartSaga(): Generator<any, void, any> {
  // action: {
  // type: string;
  // payload: { selectedVariantId: string; product: any; tempId: string; blockReducer?: boolean };
  // }
  try {
    // const { selectedVariantId } = action.payload;

    // if (!blockReducer) yield put(setLoading(true));
    // yield call({ fn: addItem, context: null }, selectedVariantId);
    // yield put(cartActions.setCart(res));
    // const state = yield select();
    // const data = {
    //   ...state?.cart?.cart,
    //   lines: [
    //     ...state?.cart?.cart?.lines.filter((v) => v.id !== tempId),
    //     res.lines.find((v) => v.merchandise.id === selectedVariantId)
    //   ]
    // };

    yield put(setLoading(false));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}
export function* addToCartsSaga(action: {
  type: string;
  payload: { merchandiseId: string; quantity: number }[];
}): Generator<any, void, any> {
  try {
    const items = action.payload;
    console.log('items', items);

    yield put(setLoading(true));

    yield call({ fn: addItems, context: null }, items);

    yield put(setLoading(false));
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}

export function* updateCartSaga(): Generator<any, void, any> {
  // action: {
  // type: string;
  // payload: { id: string; merchandiseId: string; quantity: number }[];
  // }
  try {
    // const { payload } = action;
    // yield call({ fn: updateItemQuantity, context: null }, payload);
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
      // payload: { lineIds }
    } = action;

    // yield call({ fn: removeItem, context: null }, lineIds);
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}
export function* createCartSaga(): Generator<any, void, any> {
  try {
    yield call({ fn: createCartIfNotExists, context: null });
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}

export function* cartSagaWatchers() {
  yield takeLatest(cartActions.attemptGetCarts, getCartSaga);
  yield takeLatest(cartActions.addToCart, addToCartSaga);
  yield takeLatest(cartActions.addToCarts, addToCartsSaga);
  yield takeLatest(cartActions.updateCart, updateCartSaga);
  yield takeLatest(cartActions.removeCart, removeCartSaga);
  yield takeLatest(cartActions.createCart, createCartSaga);
  yield takeLatest(cartActions.setRecommendedProduct, getRecommendedProductsSaga);
}
