import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// Files
import api from '../../constants/api';
import apiCall from '../../services/apiCall';
import {UploadAssets} from '../../types/assets';
import toast from '../../utils/toast';
import {registerThunk} from '../auth';
import Spinner from '../../utils/spinnerRef';

const initialState = {
  loading: false,
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    resetAssetsSlice: () => initialState,
    // setLoading(state, action) {
    //   state.loading = action.payload;
    // },
  },
});

export const uploadAssetsThunk = createAsyncThunk(
  'assets/uploadAssetsThunk',
  async (data: UploadAssets, {dispatch, rejectWithValue}) => {
    Spinner.show();
    let key = `${Date.now()}${data.filename}`;
    let res = await apiCall({
      type: api.apiTypes.post,
      url: api.endpoints.UPLOAD_ASSET_URL,
      data: {
        filename: key,
        contentType: data.contentType,
        path: 'uploads/images/',
      },
      enableLoader: false,
    });

    if (res?.status && data.imageData?.uri) {
      const imageFormData = await fetch(data.imageData?.uri);
      const blob = await imageFormData.blob();
      fetch(res.url, {
        method: 'PUT',
        body: blob,
      })
        .then(response => {
          if (response.status === 200 && response.ok) {
            dispatch(
              registerThunk({
                email: data.email,
                name: data.name,
                cancelToken: data.cancelToken,
                password: data.password,
                key: key,
              }),
            );
          }
        })
        .catch(e => {
          console.log(e);
          toast.showErrorMessage(
            'failed to upload the image, try after sometime',
          );
        })
        .finally(() => {
          Spinner.hide();
        });
    } else {
      toast.showErrorMessage(res?.message);
      rejectWithValue(res);
      Spinner.hide();
    }
  },
);

export const getAssetsThunk = createAsyncThunk(
  'assets/getAssetsThunk',
  async (key: string, {rejectWithValue}) => {
    let res = await apiCall({
      type: api.apiTypes.post,
      url: api.endpoints.GET_ASSET_URL,
      data: {
        key: `uploads/images/${key}`,
      },
      enableLoader: false,
    });
    if (res.status) {
      return res.url;
    } else {
      rejectWithValue('no image found');
    }
  },
);

export const {resetAssetsSlice} = assetsSlice.actions;

export default assetsSlice.reducer;
