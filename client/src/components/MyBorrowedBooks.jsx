import React, { useState, useEffect } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice"; // ✅ import thunk
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  // Redux state
  const { borrowedBooks: userBorrowedBooks, loading, error } = useSelector(
    (state) => state.borrow
  );
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});

  // ✅ Fetch on component mount
  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  const openReadPopup = (book) => {
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  // filter state
  const [filter, setFilter] = useState("returned");

  const returnedBooks =
    userBorrowedBooks?.filter((b) => b.returnDate !== null) || [];
  const nonReturnedBooks =
    userBorrowedBooks?.filter((b) => b.returnDate === null) || [];

  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Borrowed Books
          </h2>
        </header>

        {/* Show loading or error */}
        {loading && (
          <p className="mt-4 text-blue-500 font-medium">Loading borrowed books...</p>
        )}
        {error && (
          <p className="mt-4 text-red-500 font-medium">Error: {error}</p>
        )}

        {/* Filter Buttons */}
        <header className="flex flex-col gap-3 sm:flex-row md:items-center mt-4">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg
              sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "returned"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setFilter("returned")}
          >
            Returned Books
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg
              sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "non-returned"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setFilter("non-returned")}
          >
            Non-Returned Books
          </button>
        </header>

        {/* Table */}
        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  <th className="px-4 py-2 text-left">Borrow Date</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Returned</th>
                  <th className="px-4 py-2 text-left">View</th>
                </tr>
              </thead>

              <tbody>
                {booksToDisplay.map((borrow, index) => (
                  <tr
                    key={index}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {borrow.book?.id?.title || "Unknown"}
                    </td>
                    <td className="px-4 py-2">
                      {borrow.book?.id?.author || "Unknown Author"}
                    </td>
                    <td className="px-4 py-2">
                      {formatDate(borrow.borrowDate)}
                    </td>
                    <td className="px-4 py-2">{formatDate(borrow.dueDate)}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        borrow.returnDate ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {borrow.returnDate ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2">
                      {borrow.book?.id && (
                        <BookA
                          className="cursor-pointer hover:text-blue-500"
                          onClick={() => openReadPopup(borrow.book.id)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !loading && ( // ✅ only show when not loading
          filter === "returned" ? (
            <h3 className="text-1xl mt-5 font-medium text-green-600">
              No returned books found!
            </h3>
          ) : (
            <h3 className="text-1xl mt-5 font-medium text-yellow-600">
              No non-returned books found!
            </h3>
          )
        )}
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;
