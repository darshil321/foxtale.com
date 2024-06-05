import { createSlice } from '@reduxjs/toolkit';

export interface collectionState {
  collections: any[];
  collectionsProducts: any[];
  error: any;
}

export const initialState: collectionState = {
  collections: [],
  collectionsProducts: [],
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
    }
  }
});

export const { setCollections, setCollectionProduct } = collectionsSlice.actions;
export default collectionsSlice.reducer;
