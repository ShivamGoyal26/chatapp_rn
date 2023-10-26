import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// Files

const initialState = {
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthSlice: () => initialState,
    setUserData(state, action) {
      state.userData = action.payload;
    },
  },
});

export const getUserDataThunk = createAsyncThunk(
  'auth/getUserDataThunk',
  async (email: string, {dispatch, getState}) => {
    dispatch(setUserData('shsjs'));
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({name: 'default', email: email, adddress: 'sj'});
      }, 2000);
    });
  },
);

export const {resetAuthSlice, setUserData} = authSlice.actions;

export default authSlice.reducer;
