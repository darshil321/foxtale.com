import { createCartIfNotExists } from '@/components/cart/actions';
import { call, debounce, delay, put, select, takeLatest } from 'redux-saga/effects';
import { cartActions } from 'store/actions/cart.action';
import {
  removeLoadingId,
  setCartId,
  setLoading,
  setRecommendedProduct
} from '../slices/cart-slice';
import { v4 as uuidv4 } from 'uuid';
import { addToCart, getCart, getProductRecommendations, updateCart } from '@/lib/shopify';
import { getDefaultVariant } from '@/lib/helper/helper';

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

export function* createCartSaga(): Generator<any, void, any> {
  try {
    yield call({ fn: createCartIfNotExists, context: null });
  } catch (error) {
    yield put(cartActions.getCartFailed());
  }
}

export function* manageCartSaga(action: {
  type: string;
  payload: {
    updatedCart: any;
    isLoading: boolean;
  };
}): Generator<any, void, any> {
  const id = uuidv4();

  try {
    // yield put(setLoadingId(id));
    // if (isLoading) {
    yield put(setLoading(true));
    // }
    const { updatedCart } = action.payload;
    console.log('updatedCart', updatedCart);
    const cartId = yield call({ fn: createCartIfNotExists, context: null });
    const state = yield select();

    if (!state.cart.cartId) {
      yield put(setCartId(cartId));
    }

    if (!cartId) {
      console.log('cartId not found');
      yield put(removeLoadingId(id));
      return;
    }

    const cartRes = yield call({ fn: getCart, context: null }, cartId);
    console.log('cartRes', cartRes);

    const willRemove = cartRes.lines.filter(
      (item: any) =>
        !updatedCart.lines.some((cartItem: any) => cartItem.merchandise.id === item.merchandise.id)
    );

    const { willUpdate, willAdd } = updatedCart.lines.reduce(
      (acc: any, curr: any) => {
        const exist = cartRes.lines.find(
          (line: any) => line?.merchandise?.id === curr?.merchandise?.id
        );

        if (!exist) {
          acc.willAdd.push(curr);
        } else {
          // if (exist.quantity !== curr.quantity) {
          acc.willUpdate.push({ ...curr, id: exist.id });
          // }
        }
        return acc;
      },

      { willUpdate: [], willAdd: [] }
    );

    if (willAdd.length > 0) {
      const addPayload = willAdd.map((item: any) => ({
        quantity: item.quantity,
        merchandiseId: item.merchandise.id
      }));
      const res = yield call({ fn: addToCart, context: null }, cartId, addPayload);
      console.log('willAdd', addPayload, res);
    }

    yield put(delay(200));

    if (willUpdate.length > 0 || willRemove.length > 0) {
      const removePayload = willRemove.map((item: any) => ({
        id: item.id,
        merchandiseId: item.merchandise.id,
        quantity: 0
      }));
      const updatePayload = willUpdate.map((item: any) => ({
        id: item.id,
        merchandiseId: item.merchandise.id,
        quantity: item.quantity
      }));

      const res = yield call({ fn: updateCart, context: null }, cartId, [
        ...updatePayload,
        ...removePayload
      ]);
      console.log('willUpdate', updatePayload, res);
    }

    // yield put(removeLoadingId(id));
    // if (isLoading) {
    yield put(setLoading(false));
    // }
  } catch (error) {
    console.log('error', error);
    // yield put(removeLoadingId(id));
    // if (isLoading) {
    yield put(setLoading(false));
    console.log('***Error');
    // }
    console.log('error', error);
  }
}

export function* cartSagaWatchers() {
  yield takeLatest(cartActions.createCart, createCartSaga);
  yield takeLatest(cartActions.getCart, getCartSaga);
  yield takeLatest(cartActions.setRecommendedProduct, getRecommendedProductsSaga);
  yield debounce(900, cartActions.manageCart, manageCartSaga);
}
