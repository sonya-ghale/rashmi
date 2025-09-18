import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";
import { Helmet } from "react-helmet-async";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, message, borrowedBooks } = useSelector(
    (state) => state.borrow
  );

  const [filter, setFilter] = useState("borrowed");

  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  const formatDateAndTime = (timeStamp) => {
    if (!timeStamp) return "—";
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const currentDate = new Date();

  const borrowedList = (borrowedBooks || []).filter(
    (b) => !b.returnDate && new Date(b.dueDate) > currentDate
  );
  const overdueList = (borrowedBooks || []).filter(
    (b) => !b.returnDate && new Date(b.dueDate) <= currentDate
  );

  const booksToDisplay = filter === "borrowed" ? borrowedList : overdueList;

  const [email, setEmail] = useState(null);
  const [borrowedRecordId, setBorrowedRecordId] = useState(null);

  const openReturnBookPopup = (bookId, borrowerEmail, borrowRecordId) => {
    setBorrowedRecordId(borrowRecordId || null);
    setEmail(borrowerEmail || null);
    dispatch(toggleReturnBookPopup());
  };

  return (
    <>
      <Helmet>
        <title>Catelog</title>
        <meta name="description" content="Catelog" />
      </Helmet>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header / Filter Buttons */}
        <header className="flex flex-col gap-3 sm:flex-row md:items-center">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg
              sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "borrowed"
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg
              sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "overdue"
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setFilter("overdue")}
          >
            Overdue Borrowers
          </button>
        </header>

        {/* Loading / Error */}
        {loading && (
          <p className="mt-4 text-blue-500">Loading borrowed books...</p>
        )}
        {error && <p className="mt-4 text-red-500">Error: {error}</p>}

        {/* Table */}
        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Borrow Date</th>
                  <th className="px-4 py-2 text-left">Return</th>
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((b, i) => (
                  <tr
                    key={b._id || i}
                    className={(i + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{b?.user?.name || "Unknown"}</td>
                    {/* ✅ Show email directly */}
                    <td className="px-4 py-2">
                      {b?.user?.email ? b.user.email : "No Email Found"}
                    </td>
                    <td className="px-4 py-2">{b?.price ?? "-"}</td>
                    <td className="px-4 py-2">
                      {formatDateAndTime(b?.dueDate)}
                    </td>
                    <td className="px-4 py-2">
                      {formatDateAndTime(b?.borrowDate)}
                    </td>
                    <td className="px-4 py-2">
                      {b.returnDate ? (
                        <FaSquareCheck className="w-6 h-8 text-green-600" />
                      ) : (
                        <PiKeyReturnBold
                          onClick={() =>
                            openReturnBookPopup(
                              b?.book?.id?._id,
                              b?.user?.email,
                              b?._id
                            )
                          }
                          className="w-6 h-8 cursor-pointer hover:text-blue-500"
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
            <h3 className="text-1xl mt-5 font-medium">
              No {filter === "borrowed" ? "borrowed" : "overdue"} books found!
            </h3>
          )
        )}
      </main>

      {returnBookPopup && (
        <ReturnBookPopup bookId={borrowedRecordId} email={email} />
      )}
    </>
  );
};

export default Catalog;
