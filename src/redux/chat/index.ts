import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiCall from '../../services/apiCall';
import api from '../../constants/api';
import toast from '../../utils/toast';
import {ChatItem} from '../../types/chat';

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
  async (data = null, {dispatch}) => {
    return new Promise(async (resolve, reject) => {
      let res = await apiCall({
        type: api.apiTypes.get,
        url: api.endpoints.USER_CHATS,
      });
      if (res?.status) {
        resolve(res);
      } else {
        toast.showErrorMessage(res?.message);
        reject(res?.message);
      }
    });
  },
);

export const {setUserChats, resetChatSlice} = chatSlice.actions;

export default chatSlice.reducer;
