// src/popups/RecordBookPopup.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { borrowBook } from "../store/slices/borrowSlice";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.borrow);

  // ✅ Close popup on success
  useEffect(() => {
    if (message) {
      dispatch(toggleRecordBookPopup());
    }
  }, [message, dispatch]);

  // ✅ Handle borrow action
  const handleRecordBook = (e) => {
    e.preventDefault();
    dispatch(borrowBook(bookId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Record Book</h3>
          <button
            onClick={() => dispatch(toggleRecordBookPopup())}
            className="text-gray-600 hover:text-gray-900 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Confirm Borrow Form */}
        <form onSubmit={handleRecordBook} className="flex flex-col gap-4">
          <p className="text-gray-700">
            Are you sure you want to record this book as borrowed?
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => dispatch(toggleRecordBookPopup())}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Recording..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordBookPopup;
