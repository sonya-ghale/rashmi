// src/pages/MyBorrowedBooks.jsx
import { useState, useEffect } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice"; 
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { borrowedBooks: userBorrowedBooks, loading, error } = useSelector(
    (state) => state.borrow
  );
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});
  const [activeTab, setActiveTab] = useState("all"); // all | returned | non-returned

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

  // Filter books based on active tab
  const displayedBooks = userBorrowedBooks?.filter((b) => {
    if (activeTab === "returned") return b.returnDate !== null;
    if (activeTab === "non-returned") return b.returnDate === null;
    return true; // all
  });

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            My Borrowed Books
          </h2>
        </header>

        {/* Tabs */}
        <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:space-x-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-4 font-semibold rounded ${
              activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            All Borrowed
          </button>
          <button
            onClick={() => setActiveTab("returned")}
            className={`py-2 px-4 font-semibold rounded ${
              activeTab === "returned" ? "bg-green-500 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            Returned
          </button>
          <button
            onClick={() => setActiveTab("non-returned")}
            className={`py-2 px-4 font-semibold rounded ${
              activeTab === "non-returned" ? "bg-yellow-500 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            Non-Returned
          </button>
        </div>

        {/* Loading/Error */}
        {loading && <p className="mt-4 font-medium text-blue-500">Loading borrowed books...</p>}
        {error && <p className="mt-4 font-medium text-red-500">Error: {error}</p>}

        {/* Table */}
        {displayedBooks && displayedBooks.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="text-white bg-blue-500">
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
                {displayedBooks.map((borrow, index) => (
                  <tr key={index} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{borrow.book?.title || "Unknown"}</td>
                    <td className="px-4 py-2">{borrow.book?.author || "Unknown Author"}</td>
                    <td className="px-4 py-2">{formatDate(borrow.borrowDate)}</td>
                    <td className="px-4 py-2">{formatDate(borrow.dueDate)}</td>
                    <td className={`px-4 py-2 font-semibold ${borrow.returnDate ? "text-green-600" : "text-yellow-600"}`}>
                      {borrow.returnDate ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2">
                      {borrow.book?.id && (
                        <BookA
                          className="cursor-pointer hover:text-blue-500"
                          onClick={() => openReadPopup(borrow.book)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <h3 className="mt-5 font-medium text-gray-600 text-1xl">
              No books found in this category!
            </h3>
          )
        )}
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;
