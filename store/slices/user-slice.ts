import { createSlice } from '@reduxjs/toolkit';

interface InitialStateType {
  isAuthenticated: boolean;
  loading: boolean;
  error: any;
}

export const initialState: InitialStateType = {
  isAuthenticated: false,
  loading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleAuth: (state) => {
      // const data = current(state);

      state.loading = false;
    }
  }
});

export const { toggleAuth } = userSlice.actions;
export default userSlice.reducer;
