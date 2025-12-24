import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setEventData: (state, action) => {
      state.data = action.payload;
    },
    setEventLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEventError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setEventData, setEventLoading, setEventError } = eventSlice.actions;

export default eventSlice.reducer;
