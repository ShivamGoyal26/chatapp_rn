import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../constants/api';
import apiCall from '../../services/apiCall';
import {UploadAssets} from '../../types/assets';
import toast from '../../utils/toast';

// Files

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
  async (data: UploadAssets, {dispatch}) => {
    return new Promise(async (resolve, reject) => {
      console.log({
        filename: data.filename,
        contentType: data.contentType,
      });
      let res = await apiCall({
        type: api.apiTypes.post,
        url: api.endpoints.UPLOAD_ASSET_URL,
        data: {
          filename: data.filename,
          contentType: data.contentType,
        },
      });
      console.log(res);
      if (res?.status) {
        // const imageFormData = new FormData();
        // imageFormData.append('file', {
        //   uri: data.imageData?.uri,
        //   name: data.filename,
        //   type: data.contentType,
        // });
        // let imageResponse = await apiCall({
        //   type: api.apiTypes.put,
        //   url: res.url,
        //   data: imageFormData,
        //   replaceHeaders: {
        //     'Content-Type': data.contentType,
        //   },
        // });
        // console.log(imageResponse);
      } else {
        if (res?.message !== 'Cancelled') {
          toast.showErrorMessage(res?.message);
        }
        reject(res);
      }
    });
  },
);

export const {resetAssetsSlice} = assetsSlice.actions;

export default assetsSlice.reducer;
