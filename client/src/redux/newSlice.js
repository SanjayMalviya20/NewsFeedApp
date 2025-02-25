// src/redux/newsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch news from the backend API
export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await axios.get("http://localhost:4444/api/news");
  return response.data;
});

const newsSlice = createSlice({
  name: "news",
  initialState: {
    newsList: [],
    categorys: "All",
    status: "idle",
    error: null,
  },
  reducers: {
    // Action to add a single news item (from Socket.io updates)
    addNews: (state, action) => {
      state.newsList.unshift(action.payload);
    },
    setCategorys: (state, action) => {
      state.categorys =action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newsList = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addNews ,setCategorys} = newsSlice.actions;
export default newsSlice.reducer;
