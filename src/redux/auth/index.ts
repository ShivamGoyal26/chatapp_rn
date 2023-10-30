import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// Files
import {LoginInputData, SignUpInputData} from '../../types/auth';
import api from '../../constants/api';
import apiCall from '../../services/apiCall';
import toast from '../../utils/toast';

const initialState = {
  userData: null,
  authToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthSlice: () => initialState,
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setAuthToken(state, action) {
      state.authToken = action.payload;
    },
  },
});

export const loginThunk = createAsyncThunk(
  'auth/loginThunk',
  async (data: {data: LoginInputData; cancelToken: any}, {dispatch}) => {
    return new Promise(async (resolve, reject) => {
      let res = await apiCall({
        type: api.apiTypes.post,
        url: api.endpoints.LOGIN_URL,
        data: data.data,
        cancelToken: data.cancelToken,
      });
      if (res?.status) {
        dispatch(setUserData(res.data));
        dispatch(setAuthToken(res.data.token));
        resolve(res);
      } else {
        if (res?.message !== 'Cancelled') {
          toast.showErrorMessage(res?.message);
        }
        reject(res?.message);
      }
    });
  },
);

export const registerThunk = createAsyncThunk(
  'auth/registerThunk',
  async (data: {data: SignUpInputData; cancelToken: any}, {dispatch}) => {
    return new Promise(async (resolve, reject) => {
      let res = await apiCall({
        type: api.apiTypes.post,
        url: api.endpoints.SIGNUP_URL,
        data: data.data,
        cancelToken: data.cancelToken,
      });
      if (res?.status) {
        dispatch(setUserData(res.data));
        dispatch(setAuthToken(res.data.token));
        resolve(res);
      } else {
        if (res?.message !== 'Cancelled') {
          toast.showErrorMessage(res?.message);
        }
        reject(res?.message);
      }
    });
  },
);

export const {resetAuthSlice, setUserData, setAuthToken} = authSlice.actions;

export default authSlice.reducer;
