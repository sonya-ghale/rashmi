import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddBookPopup } from "./popUpSlice";

const userSlice = createSlice({
  name: "User",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Fetch All Users
    fetchAllUsersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Add New Admin
    addNewAdminRequest(state) {
      state.loading = true;
      state.error = null;
    },
    addNewAdminSuccess(state) {
      state.loading = false;
    },
    addNewAdminFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const fetchAllUsers = () => async (dispatch) => {
  try {
    dispatch(userSlice.actions.fetchAllUsersRequest());

    const { data } = await axios.get("http://localhost:4000/api/v1/user/all", {
      withCredentials: true,
    });

    dispatch(userSlice.actions.fetchAllUsersSuccess(data.users));
  } catch (err) {
    dispatch(
      userSlice.actions.fetchAllUsersFailed(
        err.response?.data?.message || err.message
      )
    );
    toast.error(err.response?.data?.message || "Failed to fetch users");
  }
};

export const addNewAdmin = (formData) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.addNewAdminRequest());

    const { data } = await axios.post(
      "http://localhost:4000/api/v1/user/add/new-admin",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(userSlice.actions.addNewAdminSuccess());
    toast.success(data.message);
    dispatch(toggleAddBookPopup());
  } catch (err) {
    dispatch(
      userSlice.actions.addNewAdminFailed(
        err.response?.data?.message || err.message
      )
    );
    toast.error(err.response?.data?.message || "Failed to add admin");
  }
};

export default userSlice.reducer;
