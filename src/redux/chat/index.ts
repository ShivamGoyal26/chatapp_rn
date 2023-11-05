import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiCall from '../../services/apiCall';
import api from '../../constants/api';
import toast from '../../utils/toast';
import {
  AddUsersGroupAPIBodyData,
  ChatItem,
  CreateGroupBody,
  RemoveUserFromGroupAPIBodyData,
} from '../../types/chat';
import {PageProps} from '../../types/common';
import {t} from 'i18next';
import {goBack} from '../../utils/routerServices';

// Files

const initialState: {
  userChats: ChatItem[] | [];
  chatInfo: ChatItem | null;
} = {
  userChats: [],
  chatInfo: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChatSlice: () => initialState,
    setUserChats(state, action) {
      state.userChats = action.payload;
    },
    setChatInfo(state, action) {
      state.chatInfo = action.payload;
    },
  },
});

export const getUserChatsThunk = createAsyncThunk(
  'chat/getUserChatsThunk',
  async (userChatParams: PageProps) => {
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
  async (data: CreateGroupBody) => {
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

export const removeUserFromGroupThunk = createAsyncThunk(
  'chat/removeUserFromGroupThunk',
  async (data: RemoveUserFromGroupAPIBodyData) => {
    if (!data?.chatId) {
      return toast.showErrorMessage(t('messagesNamespace.enterChatId'));
    }
    if (!data.userId) {
      return toast.showErrorMessage(t('messagesNamespace.enterUserId'));
    }
    return new Promise(async (resolve, reject) => {
      let res = await apiCall({
        type: api.apiTypes.put,
        url: api.endpoints.REMOVE_USER,
        data: data,
        enableLoader: false,
      });
      if (res?.status) {
        console.log('This is the res', res);
        toast.showSuccessMessage(res.message);
        resolve({data: res.data});
      } else {
        toast.showErrorMessage(res?.message);
        reject(res?.message);
      }
    });
  },
);

export const addUserFromGroupThunk = createAsyncThunk(
  'chat/addUserFromGroupThunk',
  async (data: AddUsersGroupAPIBodyData) => {
    if (!data?.chatId) {
      return toast.showErrorMessage(t('messagesNamespace.enterChatId'));
    }
    if (!data.userIds?.length) {
      return toast.showErrorMessage(t('messagesNamespace.enterUserId'));
    }
    return new Promise(async (resolve, reject) => {
      let res = await apiCall({
        type: api.apiTypes.put,
        url: api.endpoints.ADD_USER,
        data: data,
        enableLoader: false,
      });
      if (res?.status) {
        toast.showSuccessMessage(res.message);
        resolve({data: res.data});
      } else {
        toast.showErrorMessage(res?.message);
        reject(res?.message);
      }
    });
  },
);

export const {setUserChats, resetChatSlice, setChatInfo} = chatSlice.actions;

export default chatSlice.reducer;
