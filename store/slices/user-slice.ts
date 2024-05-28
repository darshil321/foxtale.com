import { createSlice } from '@reduxjs/toolkit';

interface InitialStateType {
  isAuthenticated: boolean;
  loading: boolean;
  error: any;
  feraUser: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export const initialState: InitialStateType = {
  isAuthenticated: false,
  loading: false,
  error: null,
  feraUser: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFeraUser: (state, action) => {
      state.feraUser = action.payload;
    },
    toggleAuth: (state) => {
      // const data = current(state);

      state.loading = false;
    }
  }
});

export const { toggleAuth, setFeraUser } = userSlice.actions;
export default userSlice.reducer;
