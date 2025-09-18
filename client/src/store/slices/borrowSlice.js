import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/v1/borrow";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    borrowedBooks: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    // Borrow
    borrowRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    borrowSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      // optional: update borrowedBooks immediately
      if (action.payload.borrow) {
        state.borrowedBooks.push(action.payload.borrow);
      }
    },
    borrowFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Return
    returnRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    returnSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      // optional: update state to mark book returned
      if (action.payload.bookId) {
        state.borrowedBooks = state.borrowedBooks.map((b) =>
          b.book.id === action.payload.bookId
            ? { ...b, returnDate: new Date(), returned: true }
            : b
        );
      }
    },
    returnFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch
    fetchBorrowRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBorrowSuccess: (state, action) => {
      state.loading = false;
      state.borrowedBooks = action.payload;
    },
    fetchBorrowFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetBorrowSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      // keep borrowedBooks intact
    },
  },
});

// 📌 Thunks

export const borrowBook = (bookId) => async (dispatch) => {
  dispatch(borrowSlice.actions.borrowRequest());
  try {
    const res = await axios.post(
      `${API}/record-borrow-book/${bookId}`,
      {},
      { withCredentials: true }
    );
    dispatch(
      borrowSlice.actions.borrowSuccess({
        message: res.data.message,
        borrow: res.data.borrow, // if backend sends it
      })
    );
    dispatch(fetchUserBorrowedBooks());
  } catch (err) {
    dispatch(
      borrowSlice.actions.borrowFailed(
        err.response?.data?.message || err.message || "Failed to borrow book"
      )
    );
  }
};

export const returnBook = (bookId) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnRequest());
  try {
    const res = await axios.put(
      `${API}/return-borrowed-book/${bookId}`,
      {},
      { withCredentials: true }
    );
    dispatch(
      borrowSlice.actions.returnSuccess({
        message: res.data.message,
        bookId,
      })
    );
    dispatch(fetchUserBorrowedBooks());
  } catch (err) {
    dispatch(
      borrowSlice.actions.returnFailed(
        err.response?.data?.message || err.message || "Failed to return book"
      )
    );
  }
};

export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchBorrowRequest());
  try {
    const res = await axios.get(`${API}/borrowed-books-by-users`, {
      withCredentials: true,
    });
    // Support both { borrowedBooks: [...] } and [...]
    const borrowedBooks = Array.isArray(res.data)
      ? res.data
      : res.data.borrowedBooks;
    dispatch(borrowSlice.actions.fetchBorrowSuccess(borrowedBooks));
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchBorrowFailed(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch borrowed books"
      )
    );
  }
};

export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchBorrowRequest());
  try {
    const res = await axios.get(`${API}/my-borrowed-books`, {
      withCredentials: true,
    });
    dispatch(borrowSlice.actions.fetchBorrowSuccess(res.data.borrowedBooks));
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchBorrowFailed(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch borrowed books"
      )
    );
  }
};

export const { resetBorrowSlice } = borrowSlice.actions;

export default borrowSlice.reducer;
