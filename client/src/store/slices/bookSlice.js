import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },
  reducers: {
    fetchBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
      state.message = null;
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  try {
    const res = await axios.get("http://localhost:4000/api/v1/book/all", {
      withCredentials: true,
    });

    if (res.data.success) {
      dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));
    } else {
      dispatch(bookSlice.actions.fetchBooksFailed("Failed to fetch books"));
      toast.error("Failed to fetch books");
    }
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Something went wrong";
    dispatch(bookSlice.actions.fetchBooksFailed(message));
    toast.error(message);
  }
};

export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  try {
    const res = await axios.post("http://localhost:4000/api/v1/book/admin/add", data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    dispatch(bookSlice.actions.addBookSuccess(res.data.message));
    toast.success(res.data.message || "Book added successfully!");
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Something went wrong";
    dispatch(bookSlice.actions.addBookFailed(message));
    toast.error(message);
  }
};

export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;
