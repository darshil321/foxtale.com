import { createSlice } from '@reduxjs/toolkit';

export interface ProductsState {
  products: any;
  productsByCategory: [];
  loading: boolean;
  selectedCollection: string;
  loadingByCategory: boolean;
  errorByCategory: any;
  isUserClicked: boolean;
  error: any;
  frequency: any;
  product: any;
}

export const initialState: ProductsState = {
  products: [],
  selectedCollection: '',
  productsByCategory: [],
  loadingByCategory: false,
  isUserClicked: false,
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
    },
    setSelectedCollection: (state, action) => {
      state.selectedCollection = action.payload;
    },
    setIsUserClicked: (state, action) => {
      state.isUserClicked = action.payload;
    }
  }
});

export const { getProductSuccess, attemptGetProducts, setSelectedCollection, setIsUserClicked } =
  productSlice.actions;
export default productSlice.reducer;
