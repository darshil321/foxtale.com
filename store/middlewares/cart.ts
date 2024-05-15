import { addItem, removeItem, updateItemQuantity } from '@/components/cart/actions';
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

    console.log('setting cart', action);
    const data = yield call({ fn: getCart, context: null }, cartId);
    console.log('getcart data setting', data);

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
    console.log('frgg', productId);

    const data = yield call({ fn: getProductRecommendations, context: null }, productId);
    console.log('products data setting', data);

    const res = data && data.map((p: any) => ({ product: p, variantId: getDefaultVariant(p).id }));

    yield put(setRecommendedProduct(res));
  } catch (error) {
    console.log('error', error);
  }
}

export function* addToCartSaga(action: {
  type: string;
  payload: { selectedVariantId: string; product: any; tempId: string; blockReducer?: boolean };
}): Generator<any, void, any> {
  try {
    const { selectedVariantId } = action.payload;

    // if (!blockReducer) yield put(setLoading(true));
    const res = yield call({ fn: addItem, context: null }, selectedVariantId);
    yield put(cartActions.setCart(res));
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

export function* updateCartSaga(action: {
  type: string;
  payload: { id: string; merchandiseId: string; quantity: number }[];
}): Generator<any, void, any> {
  try {
    const { payload } = action;

    yield call({ fn: updateItemQuantity, context: null }, payload);
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

    yield call({ fn: removeItem, context: null }, lineIds);
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}

export function* cartSagaWatchers() {
  yield takeLatest(cartActions.attemptGetCarts, getCartSaga);
  yield takeLatest(cartActions.addToCart, addToCartSaga);
  yield takeLatest(cartActions.updateCart, updateCartSaga);
  yield takeLatest(cartActions.removeCart, removeCartSaga);
  yield takeLatest(cartActions.setRecommendedProduct, getRecommendedProductsSaga);
}
