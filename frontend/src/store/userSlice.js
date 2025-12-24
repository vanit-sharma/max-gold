import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload;
      state.initialized = true; // once data set, we know status
      state.loading = false;
    },

    setUserDataError: (state, action) => {
      state.error = action.payload;
      state.initialized = true; // checked, but failed
      state.loading = false;
    },
    startUserLoading: (state) => {
      state.loading = true;
    },
    clearUserData: (state) => {
      state.data = null;
      state.initialized = true; // we know user is logged out
      state.loading = false;
    },
  },
});

export const {
  setUserData,
  setUserDataError,
  startUserLoading,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;
