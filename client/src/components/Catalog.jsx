import { useEffect, useState } from "react";
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

        {/* Enhanced Table */}
        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      #
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      Username
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      Borrow Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase">
                      Return
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {booksToDisplay.map((b, i) => (
                    <tr
                      key={b._id || i}
                      className="transition-colors duration-150 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {b?.user?.name || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {b?.user?.email ? b.user.email : "No Email Found"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          Rs.{b?.price ?? "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">
                            {formatDateAndTime(b?.dueDate)?.split(" ")[0]}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDateAndTime(b?.dueDate)?.split(" ")[1]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">
                            {formatDateAndTime(b?.borrowDate)?.split(" ")[0]}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDateAndTime(b?.borrowDate)?.split(" ")[1]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {b.returnDate ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <FaSquareCheck className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              openReturnBookPopup(
                                b?.book?.id?._id,
                                b?.user?.email,
                                b?._id
                              )
                            }
                            className="inline-flex items-center justify-center w-8 h-8 transition-colors duration-200 bg-blue-100 rounded-full hover:bg-blue-200 group"
                          >
                            <PiKeyReturnBold className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !loading && (
            <h3 className="mt-5 font-medium text-1xl">
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
