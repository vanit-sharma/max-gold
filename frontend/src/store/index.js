import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './eventSlice';
import loaderReducer from './loaderSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    event: eventReducer,
    loader: loaderReducer,
    userStore:userReducer
  },
});

export default store;
