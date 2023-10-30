import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// Files
import {LoginInputData, SignUpInputData, UserData} from '../../types/auth';
import api from '../../constants/api';
import apiCall from '../../services/apiCall';
import toast from '../../utils/toast';
import {resetCommonSlice} from '../common';
import {resetRoot} from '../../utils/routerServices';
import {Routes} from '../../constants';

const initialState: {
  userData: UserData | null;
  authToken: string | null;
} = {
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

export const logoutThunk = createAsyncThunk(
  'auth/logoutThunk',
  async (_, {dispatch}) => {
    return new Promise(() => {
      dispatch(resetAuthSlice());
      dispatch(resetCommonSlice());
      resetRoot(Routes.AUTH_STACK);
      // resolve('logout done');
    });
  },
);

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
        resetRoot(Routes.HOME_STACK);
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
  async (data: SignUpInputData, {dispatch}) => {
    return new Promise(async (resolve, reject) => {
      let registerData: any = {
        email: data.email,
        password: data.password,
        name: data.name,
      };
      if (data.key) {
        registerData['pic'] = data.key;
      }
      let res = await apiCall({
        type: api.apiTypes.post,
        url: api.endpoints.SIGNUP_URL,
        data: registerData,
        cancelToken: data.cancelToken,
      });
      if (res?.status) {
        dispatch(setUserData(res.data));
        dispatch(setAuthToken(res.data.token));
        resetRoot(Routes.HOME_STACK);
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
