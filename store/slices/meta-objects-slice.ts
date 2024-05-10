import { createSlice } from '@reduxjs/toolkit';

export interface MetaObjectState {
  metaObjects: any;
  error: any;
}

export const initialState: MetaObjectState = {
  metaObjects: [],
  error: false
};

export const metaObjectSlice = createSlice({
  name: 'metaobject',
  initialState,

  reducers: {
    setMetaObject: (state, action) => {
      state.metaObjects = action.payload;
    }
  }
});

export const { setMetaObject } = metaObjectSlice.actions;
export default metaObjectSlice.reducer;
