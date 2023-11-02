import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiCall from '../../services/apiCall';
import api from '../../constants/api';
import toast from '../../utils/toast';
import {ChatItem, CreateGroupBody} from '../../types/chat';
import {PageProps} from '../../types/common';
import {t} from 'i18next';
import {goBack} from '../../utils/routerServices';

// Files

const initialState: {
  userChats: ChatItem[] | [];
} = {
  userChats: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChatSlice: () => initialState,
    setUserChats(state, action) {
      state.userChats = action.payload;
    },
  },
});

export const getUserChatsThunk = createAsyncThunk(
  'chat/getUserChatsThunk',
  async (userChatParams: PageProps, {dispatch}) => {
    return new Promise(async (resolve, reject) => {
      let res = await apiCall({
        type: api.apiTypes.get,
        url: api.endpoints.USER_CHATS,
        params: userChatParams,
      });
      if (res?.status) {
        resolve({data: res.data, pages: res.pages});
      } else {
        toast.showErrorMessage(res?.message);
        reject(res?.message);
      }
    });
  },
);

export const createGroupThunk = createAsyncThunk(
  'chat/createGroupThunk',
  async (data: CreateGroupBody, {dispatch}) => {
    if (!data?.name) {
      return toast.showErrorMessage(t('messagesNamespace.groupName'));
    }
    if (data.users?.length < 2) {
      return toast.showErrorMessage(t('messagesNamespace.leastGroupMembers'));
    }
    return new Promise(async (resolve, reject) => {
      let res = await apiCall({
        type: api.apiTypes.post,
        url: api.endpoints.CREATE_GROUP,
        data: data,
      });
      if (res?.status) {
        console.log('This is the res', res);
        goBack();
        toast.showSuccessMessage(res.message);
        // resolve({data: res.data, pages: res.pages});
      } else {
        toast.showErrorMessage(res?.message);
        reject(res?.message);
      }
    });
  },
);

export const {setUserChats, resetChatSlice} = chatSlice.actions;

export default chatSlice.reducer;
