/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import range from '../utils/range.js';

const initialState = {
  value: {},
};

const makeField = (size) => Object.fromEntries(range(size).map((key) => {
  const value = Object.fromEntries(range(size).map((k) => [k, 'dead']));
  return [key, value];
}));

const fieldSlice = createSlice({
  name: 'field',
  initialState,
  reducers: {
    setField: (state, action) => {
      const size = action.payload;
      state.value = makeField(size);
    },
    toggleCell: (state, action) => {
      const { i, j } = action.payload;
      state.value[i][j] = state.value[i][j] === 'dead' ? 'alive' : 'dead';
    },
  },
});

export const { actions } = fieldSlice;

export default fieldSlice.reducer;
