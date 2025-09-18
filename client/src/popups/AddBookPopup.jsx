import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import { addBook } from "../store/slices/bookSlice";
import { toast } from "react-toastify";

const AddBookPopup = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ Client-side validations only
    if (!bookData.title || !bookData.author || !bookData.price || !bookData.quantity) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (user?.role !== "admin") {
      toast.error("Only administrators can add books");
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(addBook(bookData));
      setBookData({ title: "", author: "", price: "", quantity: "", description: "" });
      dispatch(toggleAddBookPopup());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== "admin") return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 max-h-[85vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-6">Add New Book</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-800 font-medium mb-1">Book Title *</label>
            <input
              type="text"
              name="title"
              value={bookData.title}
              onChange={handleChange}
              placeholder="Book Title"
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">Book Author *</label>
            <input
              type="text"
              name="author"
              value={bookData.author}
              onChange={handleChange}
              placeholder="Book Author"
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">Book Price (Borrowing Price) *</label>
            <input
              type="number"
              name="price"
              value={bookData.price}
              onChange={handleChange}
              placeholder="Book Price"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={bookData.quantity}
              onChange={handleChange}
              placeholder="Book Quantity"
              min="1"
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={bookData.description}
              onChange={handleChange}
              placeholder="Book Description"
              rows="3"
              className="w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => dispatch(toggleAddBookPopup())}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPopup;
