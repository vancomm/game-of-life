import { configureStore } from '@reduxjs/toolkit';
import fieldReducer from './fieldSlice.js';

export default configureStore({
  reducer: {
    field: fieldReducer,
  },
});
