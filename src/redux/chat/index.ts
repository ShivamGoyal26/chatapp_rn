import {createSlice} from '@reduxjs/toolkit';

// Files

const initialState = {
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChatSlice: () => initialState,
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {setLoading, resetChatSlice} = chatSlice.actions;

export default chatSlice.reducer;
