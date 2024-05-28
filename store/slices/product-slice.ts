import { createSlice, current } from '@reduxjs/toolkit';

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
  isReviewFormOpen: boolean;
  isUserFormOpen: boolean;
  isSuccessModalOpen: boolean;
  productReviews: any[];
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
  product: {},
  isReviewFormOpen: false,
  isUserFormOpen: false,
  isSuccessModalOpen: false,
  productReviews: []
};

export const productSlice = createSlice({
  name: 'products',
  initialState,

  reducers: {
    getProductSuccess: (state, action) => {
      const { products } = action.payload.body.data;
      state.products = products.edges;
    },
    setReviewFormOpen: (state, action) => {
      state.isReviewFormOpen = action.payload;
    },
    setUserFormOpen: (state, action) => {
      state.isUserFormOpen = action.payload;
    },

    getProductFailed: (state) => {
      // const data = current(state);
      state.loading = false;
    },
    setProductReviews: (state, action) => {
      const review = action.payload;
      const currentState = current(state);

      const existingReviews = currentState.productReviews;
      const reviewIndex = existingReviews?.findIndex(
        (r) => r.external_product_id === review.external_product_id
      );

      console.log('state.productReviewwww0', existingReviews, reviewIndex);
      if (reviewIndex !== -1 && reviewIndex !== undefined) {
        console.log('state.productReviewwww1', existingReviews, reviewIndex);

        const reviews = existingReviews?.map((r, i) =>
          i === reviewIndex ? { ...r, ...review } : r
        );
        console.log('reviews', reviews);

        state.productReviews = reviews;
      } else {
        console.log('state.productReviewww2');

        state.productReviews = [...existingReviews, review];
      }
      console.log('state.productReviews', state.productReviews, action.payload);
    },

    attemptGetProducts: () => {
      //loading true
    },
    setSelectedCollection: (state, action) => {
      state.selectedCollection = action.payload;
    },
    setIsUserClicked: (state, action) => {
      state.isUserClicked = action.payload;
    },

    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSuccessModal: (state, action) => {
      state.isSuccessModalOpen = action.payload;
    }
  }
});

export const {
  getProductSuccess,
  attemptGetProducts,
  setSelectedCollection,
  setIsUserClicked,
  setProducts,
  setReviewFormOpen,
  setUserFormOpen,
  setProductReviews,
  setSuccessModal
} = productSlice.actions;
export default productSlice.reducer;
