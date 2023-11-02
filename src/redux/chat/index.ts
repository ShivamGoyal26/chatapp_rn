import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiCall from '../../services/apiCall';
import api from '../../constants/api';
import toast from '../../utils/toast';
import {ChatItem} from '../../types/chat';
import {PageProps} from '../../types/common';

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

export const {setUserChats, resetChatSlice} = chatSlice.actions;

export default chatSlice.reducer;
