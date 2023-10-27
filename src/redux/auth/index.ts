import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {loginData} from '../../types/auth';

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
  async (data: loginData, {dispatch}) => {
    dispatch(setUserData(data));
    return await new Promise(resolve => {
      setTimeout(() => {
        resolve(data);
      }, 2000);
    });
  },
);

export const {resetAuthSlice, setUserData} = authSlice.actions;

export default authSlice.reducer;
