// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./newSlice.js";

export const store = configureStore({
  reducer: {
    news: newsReducer,
  },
});
