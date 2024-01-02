import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {CancelToken} from 'axios';

// Files
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
import {goBack, navigate} from '../../utils/routerServices';
import routes from '../../constants/routes';
import Spinner from '../../utils/spinnerRef';
import {Routes} from '../../constants';

export type MessageItem = {
  _id: string;
  sender: {
    _id: string;
    name: string;
    pic: null | string;
    email: string;
  };
  chat: {
    chatName: string;
    createdAt: string;
    isGroupChat: boolean;
    latestMessage: string;
    _id: string;
  };
  content: string;
  updatedAt: string;
  createdAt: string;
};

const initialState: {
  userChats: ChatItem[] | [];
  chatInfo: ChatItem | null;
  chatMessages: MessageItem[];
} = {
  userChats: [],
  chatInfo: null,
  chatMessages: [],
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
    setChatMessages(state, action) {
      state.chatMessages = action.payload;
    },
  },
});

export const getUserChatsThunk = createAsyncThunk(
  'chat/getUserChatsThunk',
  async (userChatParams: PageProps, {rejectWithValue}) => {
    let res = await apiCall({
      type: api.apiTypes.get,
      url: api.endpoints.USER_CHATS,
      params: userChatParams,
    });
    if (res?.status) {
      return {data: res.data, pages: res.pages};
    } else {
      toast.showErrorMessage(res?.message);
      rejectWithValue(res?.message);
    }
  },
);

export const createGroupThunk = createAsyncThunk(
  'chat/createGroupThunk',
  async (data: CreateGroupBody, {rejectWithValue}) => {
    if (!data?.name) {
      return toast.showErrorMessage(t('messagesNamespace.groupName'));
    }
    if (data.users?.length < 2) {
      return toast.showErrorMessage(t('messagesNamespace.leastGroupMembers'));
    }
    let res = await apiCall({
      type: api.apiTypes.post,
      url: api.endpoints.CREATE_GROUP,
      data: data,
    });
    if (res?.status) {
      console.log('This is the res', res);
      goBack();
      toast.showSuccessMessage(res.message);
    } else {
      toast.showErrorMessage(res?.message);
      rejectWithValue(res?.message);
    }
  },
);

export const createChatThunk = createAsyncThunk(
  'chat/createChatThunk',
  async (data: {userId: string}, {dispatch, rejectWithValue}) => {
    if (!data?.userId) {
      return toast.showErrorMessage(t('Please select the user'));
    }
    Spinner.show();
    let res = await apiCall({
      type: api.apiTypes.post,
      url: api.endpoints.CREATE_CHAT,
      data: data,
    });
    Spinner.hide();
    if (res?.status) {
      dispatch(setChatInfo(res.data));
      navigate(Routes.CHAT_STACK, {});
    } else {
      toast.showErrorMessage(res?.message);
      rejectWithValue(res?.message);
    }
  },
);

export const removeUserFromGroupThunk = createAsyncThunk(
  'chat/removeUserFromGroupThunk',
  async (data: RemoveUserFromGroupAPIBodyData, {rejectWithValue}) => {
    if (!data?.chatId) {
      return toast.showErrorMessage(t('messagesNamespace.enterChatId'));
    }
    if (!data.userId) {
      return toast.showErrorMessage(t('messagesNamespace.enterUserId'));
    }
    let res = await apiCall({
      type: api.apiTypes.put,
      url: api.endpoints.REMOVE_USER,
      data: data,
      enableLoader: false,
    });
    if (res?.status) {
      console.log('This is the res', res);
      toast.showSuccessMessage(res.message);
      return {data: res.data};
    } else {
      toast.showErrorMessage(res?.message);
      rejectWithValue(res?.message);
    }
  },
);

export const deleteGroupThunk = createAsyncThunk(
  'chat/deleteGroupThunk',
  async (data: {chatId: string}, {rejectWithValue}) => {
    if (!data?.chatId) {
      return toast.showErrorMessage(t('messagesNamespace.enterChatId'));
    }
    Spinner.show();
    let res = await apiCall({
      type: api.apiTypes.delete,
      url: api.endpoints.DELETE_GROUP,
      params: data,
      enableLoader: false,
    });
    Spinner.hide();
    if (res?.status) {
      toast.showSuccessMessage(res.message);
      navigate(routes.CHATS, {});
    } else {
      toast.showErrorMessage(res?.message);
      rejectWithValue(res?.message);
    }
  },
);

export const addUserFromGroupThunk = createAsyncThunk(
  'chat/addUserFromGroupThunk',
  async (data: AddUsersGroupAPIBodyData, {rejectWithValue}) => {
    if (!data?.chatId) {
      return toast.showErrorMessage(t('messagesNamespace.enterChatId'));
    }
    if (!data.userIds?.length) {
      return toast.showErrorMessage(t('messagesNamespace.enterUserId'));
    }
    let res = await apiCall({
      type: api.apiTypes.put,
      url: api.endpoints.ADD_USER,
      data: data,
      enableLoader: false,
    });
    if (res?.status) {
      toast.showSuccessMessage(res.message);
      return {data: res.data};
    } else {
      toast.showErrorMessage(res?.message);
      rejectWithValue(res?.message);
    }
  },
);

export const sendMessageThunk = createAsyncThunk(
  'chat/sendMessageThunk',
  async (
    data: {chatId: string | undefined; content: string},
    {rejectWithValue},
  ) => {
    if (!data?.chatId) {
      return toast.showErrorMessage(t('messagesNamespace.enterChatId'));
    }
    if (!data.content) {
      return toast.showErrorMessage(t('messagesNamespace.enterContent'));
    }
    let res = await apiCall({
      type: api.apiTypes.post,
      url: api.endpoints.SEND_MESSAGE,
      data: data,
      enableLoader: false,
    });
    if (res?.status) {
      return {data: res.data};
    } else {
      toast.showErrorMessage(res?.message);
      rejectWithValue(res?.message);
    }
  },
);

export const fetchMessagesThunk = createAsyncThunk(
  'chat/fetchMessagesThunk',
  async (
    {
      chatId,
      cancelToken,
    }: {chatId: string | undefined; cancelToken: CancelToken},
    {rejectWithValue, dispatch},
  ) => {
    if (!chatId) {
      return toast.showErrorMessage(t('messagesNamespace.enterChatId'));
    }
    let res = await apiCall({
      type: api.apiTypes.get,
      url: api.endpoints.SEND_MESSAGE,
      params: {chatId: chatId},
      enableLoader: false,
      cancelToken: cancelToken,
    });
    console.log(JSON.stringify(res));
    if (res?.status) {
      if (res.data.length) {
        dispatch(setChatMessages(res.data));
      }
    } else {
      toast.showErrorMessage(res?.message);
      rejectWithValue(res?.message);
    }
  },
);

export const {setUserChats, resetChatSlice, setChatInfo, setChatMessages} =
  chatSlice.actions;

export default chatSlice.reducer;
