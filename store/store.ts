import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import { productSlice } from './slices/product-slice';
import { userSlice } from './slices/user-slice';
import rootSaga from './slices';
import { cartSlice } from './slices/cart-slice';
import { metaObjectSlice } from './slices/meta-objects-slice';
import { collectionsSlice } from './slices/collections-slice';

const rootReducer = combineReducers({
  [productSlice.name]: productSlice.reducer,
  [userSlice.name]: (userSlice as any).reducer,
  [cartSlice.name]: cartSlice.reducer,
  [collectionsSlice.name]: collectionsSlice.reducer,
  [metaObjectSlice.name]: (metaObjectSlice as any).reducer
});

export type RootState = ReturnType<typeof store.getState>;

// Persist Configuration
const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Saga Middleware
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// Store Creation
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(middleware) as any
});

// Run Saga Middleware
sagaMiddleware.run(rootSaga);

// Persisted Store
const persistor = persistStore(store);

export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore['dispatch'];

export { store, persistor };
