import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'events',
  initialState: {
    loading: false
  },
  reducers: {
    setLoader: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoader} = loaderSlice.actions;

export default loaderSlice.reducer;
