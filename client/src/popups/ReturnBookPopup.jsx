import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { returnBook } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";

const ReturnBookPopup = ({ bookId, email }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.borrow);

  const handleReturnBook = (e) => {
    e.preventDefault();
    dispatch(returnBook({ email, bookId }));
    dispatch(toggleReturnBookPopup());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Return Book</h3>
          <button
            onClick={() => dispatch(toggleReturnBookPopup())}
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

        {/* Form */}
        <form onSubmit={handleReturnBook} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Borrower's Email
            </label>
            <input
              type="email"
              value={email}
              placeholder="Enter email"
              className="w-full px-4 py-2 border-2 border-black rounded-md"
              required
              disabled
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => dispatch(toggleReturnBookPopup())}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Recording..." : "Return"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnBookPopup;
