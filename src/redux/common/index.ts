import {createSlice} from '@reduxjs/toolkit';

// Files

const initialState = {
  loading: false,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    resetCommonSlice: () => initialState,
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {setLoading} = commonSlice.actions;

export default commonSlice.reducer;
