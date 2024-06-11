import { createSlice } from '@reduxjs/toolkit';

export interface collectionState {
  collections: any[];
  collectionsProducts: any[];
  productRating: any;
  error: any;
}

export const initialState: collectionState = {
  collections: [],
  collectionsProducts: [],
  productRating: null,
  error: false
};

export const collectionsSlice = createSlice({
  name: 'collections',
  initialState,

  reducers: {
    setCollections: (state, action) => {
      state.collections = action?.payload;
    },
    setCollectionProduct: (state, action) => {
      state.collectionsProducts = action?.payload;
    },
    setProductRating: (state, action) => {
      state.productRating = action?.payload;
    }
  }
});

export const { setCollections, setCollectionProduct, setProductRating } = collectionsSlice.actions;
export default collectionsSlice.reducer;
