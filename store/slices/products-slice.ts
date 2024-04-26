import { createSlice, current } from '@reduxjs/toolkit';

interface InitialStateType {
  products: any;
  productsByCategory: [];
  loading: boolean;
  loadingByCategory: boolean;
  errorByCategory: any;
  error: any;
  frequency: any;
  product: any;
}

export const initialState: InitialStateType = {
  products: [],
  productsByCategory: [],
  loadingByCategory: false,
  error: null,
  errorByCategory: {},
  loading: false,
  frequency: '',
  product: {}
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProductSuccess: (state, action) => {
      const data = current(state);
      console.log('product successs reducer:>> ', data, action);
      state.loading = false;
    },

    getProductFailed: (state, action) => {
      const data = current(state);
      console.log('failed reducer:>> ', data, action);
      state.loading = false;
    },

    attemptGetProducts: (state, action) => {
      console.log('attempt product reducer :>> ', action);
      //loading true
    }
  }
});

export const { getProductSuccess, attemptGetProducts } = productSlice.actions;
export default productSlice.reducer;
