import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chat";

export default configureStore({
  reducer: {
    chat: chatReducer,
  },
});
