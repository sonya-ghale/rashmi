// src/pages/BookManagement.jsx
import { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
  borrowBook, // ✅ updated borrow action
} from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import { Helmet } from "react-helmet-async";

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup
  );
  const {
    loading: borrowLoading,
    error: borrowError,
    message: borrowMessage,
    borrowedBooks,
  } = useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchKeyword] = useState("");
  const [borrowingBookId, setBorrowingBookId] = useState(null); // Track which book is being borrowed

  const openReadPopup = (id) => {
    const book = (books || []).find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  // ✅ Borrow Handler for users (no email / userId needed)
  const handleBorrow = (bookId) => {
    if (!isAuthenticated) return toast.error("You must be logged in!");
    setBorrowingBookId(bookId);
    dispatch(borrowBook(bookId)).finally(() => setBorrowingBookId(null));
  };

  // Fetch books (and borrowed books if admin)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllBooks());
      if (user?.role === "admin") {
        dispatch(fetchAllBorrowedBooks());
      }
    }
  }, [dispatch, isAuthenticated, user]);

  // Handle success/error messages
  useEffect(() => {
    if (message || borrowMessage) {
      toast.success(message || borrowMessage);
      dispatch(fetchAllBooks());
      if (user?.role === "admin") dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error || borrowError) {
      toast.error(error || borrowError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, borrowMessage, borrowError, user]);

  // Search filter
  const handleSearch = (e) => setSearchKeyword(e.target.value.toLowerCase());
  const searchedBooks = (books || []).filter((book) =>
    book.title.toLowerCase().includes(searchedKeyword)
  );

  return (
    <>
        <Helmet>
          <title>Book Management</title>
          <meta name="description" content="Book Management" />
        </Helmet>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            {user?.role === "admin" ? "Book Management" : "Books"}
          </h2>
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            {isAuthenticated && user?.role === "admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="relative flex items-center justify-center w-full gap-4 px-4 py-2 text-white bg-black rounded-md pl-14 sm:w-52 hover:bg-gray-800"
              >
                <span
                  className="bg-white flex justify-center items-center overflow-hidden 
                  rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5"
                >
                  +
                </span>
                Add Book
              </button>
            )}
            <input
              type="text"
              placeholder="Search books"
              className="w-full p-2 border border-gray-300 rounded-md sm:w-52"
              value={searchedKeyword}
              onChange={handleSearch}
            />
          </div>
        </header>

        {/* Table */}
        {loading ? (
          <p className="mt-5 text-lg font-medium">Loading books...</p>
        ) : searchedBooks.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">NAME</th>
                  <th className="px-4 py-2 text-left">AUTHOR</th>
                  {user?.role === "admin" && (
                    <th className="px-4 py-2 text-left">Quantity</th>
                  )}
                  <th className="px-4 py-2 text-left">PRICE</th>
                  <th className="px-4 py-2 text-left">Availability</th>
                  {user?.role === "admin" && (
                    <th className="px-4 py-2 text-center">Record Book</th>
                  )}
                  {user?.role === "user" && (
                    <th className="px-4 py-2 text-center">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {searchedBooks.map((book, index) => (
                  <tr
                    key={book._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    {user?.role === "admin" && (
                      <td className="px-4 py-2">{book.quantity}</td>
                    )}
                    <td className="px-4 py-2">{`Rs.${book.price}`}</td>
                    <td className="px-4 py-2">
                      {book.availability ? "Available" : "Unavailable"}
                    </td>

                    {/* ✅ Admin Actions */}
                    {user?.role === "admin" && (
                      <td className="flex justify-center px-4 py-2 my-3 space-x-2">
                        <BookA onClick={() => openReadPopup(book._id)} />
                        <NotebookPen
                          onClick={() => openRecordBookPopup(book._id)}
                        />
                      </td>
                    )}

                    {/* ✅ User Borrow Action */}
                    {user?.role === "user" && (
                      <td className="px-4 py-2 text-center">
                        {book.availability ? (
                          (() => {
                            // Check if this book is already borrowed and not returned
                            const isBorrowed = borrowedBooks?.some(
                              (b) =>
                                b.book._id === book._id && b.returnDate === null
                            );
                            if (isBorrowed) {
                              return (
                                <button
                                  disabled
                                  className="px-3 py-1 text-white bg-red-500 rounded-md cursor-not-allowed"
                                >
                                  Borrowed Already
                                </button>
                              );
                            } else {
                              return (
                                <button
                                  onClick={() => handleBorrow(book._id)}
                                  className={`px-3 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
                                    borrowingBookId === book._id
                                      ? "opacity-70"
                                      : ""
                                  }`}
                                  disabled={
                                    borrowingBookId === book._id &&
                                    borrowLoading
                                  }
                                >
                                  {borrowingBookId === book._id && borrowLoading
                                    ? "Borrowing..."
                                    : "Borrow"}
                                </button>
                              );
                            }
                          })()
                        ) : (
                          <span className="text-gray-500">Not Available</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="mt-5 text-3xl font-medium">
            No books found in library!
          </h3>
        )}
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;
