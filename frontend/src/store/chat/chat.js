import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// const token = localStorage.getItem('access_token')


const initialState = {
  // MessageList: [],
  // ChatRoomList: [],
};



export const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    Chatting: (state, action) => {
      state.MessageList.push(action.payload.data);
    },
  },
  extraReducers: 
  (builder) => {
    builder.addCase(Chatting.fulfilled, (state, action) => {
      state.MessageList.push(action.payload.data);
    });
  },
});

export const { Chatting } = chat.actions;
export default chat.reducer;
