import { createSlice } from '@reduxjs/toolkit';

export interface ProductsState {
  products: any;
  productsByCategory: [];
  loading: boolean;
  loadingByCategory: boolean;
  errorByCategory: any;
  error: any;
  frequency: any;
  product: any;
}

export const initialState: ProductsState = {
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
      const { products } = action.payload.body.data;
      state.products = products.edges;
    },

    getProductFailed: (state) => {
      // const data = current(state);
      state.loading = false;
    },

    attemptGetProducts: () => {
      //loading true
    }
  }
});

export const { getProductSuccess, attemptGetProducts } = productSlice.actions;
export default productSlice.reducer;
