// src/redux/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatHistory: [
      { user: "AI: Hello! How can I help you today?", ai: "", type: "ai" },
    ],
    loading: false,
    error: null,
    selectedChat: null, // Stores the currently selected chat
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    sendMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearChat: (state) => {
      state.chatHistory = [];
    },
  },
});

// Export actions
export const { sendMessage, setLoading, setError, clearChat, setSelectedChat } =
  chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;
