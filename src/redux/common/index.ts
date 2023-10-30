import {createSlice} from '@reduxjs/toolkit';

// Files

const initialState = {
  loading: false,
  isInternet: true,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    resetCommonSlice: () => initialState,
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setIsInternet(state, action) {
      state.isInternet = action.payload;
    },
  },
});

export const {setLoading, setIsInternet, resetCommonSlice} =
  commonSlice.actions;

export default commonSlice.reducer;
