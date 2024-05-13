import { createSlice } from '@reduxjs/toolkit';

export interface collectionState {
  collections: any[];
  error: any;
}

export const initialState: collectionState = {
  collections: [],
  error: false
};

export const collectionsSlice = createSlice({
  name: 'collections',
  initialState,

  reducers: {
    setCollections: (state, action) => {
      state.collections = action.payload;
    }
  }
});

export const { setCollections } = collectionsSlice.actions;
export default collectionsSlice.reducer;
