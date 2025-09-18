// src/pages/BookManagement.jsx
import { useEffect, useState, useMemo } from "react";
import { BookA, NotebookPen, TrendingUp, DollarSign, Package, Users } from "lucide-react";
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
  borrowBook,
} from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import { Helmet } from "react-helmet-async";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
  const [borrowingBookId, setBorrowingBookId] = useState(null);

  const openReadPopup = (id) => {
    const book = (books || []).find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  const handleBorrow = (bookId) => {
    if (!isAuthenticated) return toast.error("You must be logged in!");
    setBorrowingBookId(bookId);
    dispatch(borrowBook(bookId)).finally(() => setBorrowingBookId(null));
  };

  // Fetch books
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllBooks());
      if (user?.role === "admin") dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, isAuthenticated, user]);

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

  const handleSearch = (e) => setSearchKeyword(e.target.value.toLowerCase());
  const searchedBooks = (books || []).filter((book) =>
    book.title.toLowerCase().includes(searchedKeyword)
  );

  // ---------- Graph Data Calculations ----------
  const bookPriceData = useMemo(() => {
    if (!books || books.length === 0) return null;
    const prices = books.map((b) => b.price);
    const maxPriceBook = books.find((b) => b.price === Math.max(...prices));
    const minPriceBook = books.find((b) => b.price === Math.min(...prices));
    return { maxPriceBook, minPriceBook };
  }, [books]);

  const mostBorrowedBooks = useMemo(() => {
    if (!books || !borrowedBooks) return [];
    const borrowCountMap = {};
    borrowedBooks.forEach((b) => {
      const bookId = b.book._id;
      borrowCountMap[bookId] = (borrowCountMap[bookId] || 0) + 1;
    });
    return books
      .map((b) => ({ ...b, borrowCount: borrowCountMap[b._id] || 0 }))
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5); // top 5 most borrowed
  }, [books, borrowedBooks]);

  const quantityData = useMemo(() => {
    if (!books || books.length === 0) return null;
    return {
      labels: books.map((b) => b.title),
      datasets: [
        {
          label: "Quantity",
          data: books.map((b) => b.quantity),
          backgroundColor: "rgba(99, 102, 241, 0.8)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  }, [books]);

  const quantityOptions = { 
    responsive: true, 
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280' }
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#6b7280' }
      }
    }
  };

  // ---------- Pie Chart for Availability ----------
  const availableBooks = books?.filter((b) => b.availability).length || 0;
  const unavailableBooks = (books?.length || 0) - availableBooks;
  const pieData = {
    labels: ["Available", "Borrowed/Unavailable"],
    datasets: [
      {
        data: [availableBooks, unavailableBooks],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["#22c55e", "#ef4444"],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };
  const pieOptions = { 
    responsive: true, 
    plugins: { 
      legend: { 
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
      }
    } 
  };

  // Stats cards data
  const statsData = [
    {
      title: "Total Books",
      value: books?.length || 0,
      icon: Package,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Available Books",
      value: availableBooks,
      icon: BookA,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },

    {
      title: "Average Price",
      value: books?.length ? `Rs.${Math.round(books.reduce((sum, b) => sum + b.price, 0) / books.length)}` : "Rs.0",
      icon: DollarSign,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Book Management</title>
        <meta name="description" content="Book Management" />
      </Helmet>
      <main className="relative flex-1 min-h-screen p-6 pt-28 bg-gray-50">
        <Header />
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {user?.role === "admin" ? "Book List / Overview" : "Library Books"}
              </h1>
              <p className="text-gray-600">
                {user?.role === "admin" 
                  ? "Manage your library collection and track book statistics" 
                  : "Browse and borrow books from our collection"
                }
              </p>
            </div>
            
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              {isAuthenticated && user?.role === "admin" && (
                <button
                  onClick={() => dispatch(toggleAddBookPopup())}
                  className="relative flex items-center justify-center gap-3 px-6 py-3 text-white transition-all duration-200 transform rounded-lg shadow-lg group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105"
                >
                  <div className="flex items-center justify-center w-6 h-6 text-sm font-bold rounded-full bg-white/20">
                    +
                  </div>
                  Add New Book
                </button>
              )}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full py-3 pl-4 pr-4 transition-all duration-200 border border-gray-200 rounded-lg shadow-sm lg:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchedKeyword}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {user?.role === "admin" && (
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
              <div key={index} className={`${stat.bgColor} rounded-xl p-6 shadow-sm border border-gray-100`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-600">Loading books...</p>
            </div>
          </div>
        ) : searchedBooks.length > 0 ? (
          <>
            {/* Books Table */}
            <div className="mb-8 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Book Name</th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Author</th>
                      {user?.role === "admin" && <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Quantity</th>}
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Status</th>
                      {user?.role === "admin" && <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase">Actions</th>}
                      {user?.role === "user" && <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchedBooks.map((book, index) => (
                      <tr key={book._id} className="transition-colors duration-150 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {book.author}
                        </td>
                        {user?.role === "admin" && (
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {book.quantity}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          Rs.{book.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            book.availability 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {book.availability ? "Available" : "Unavailable"}
                          </span>
                        </td>

                        {user?.role === "admin" && (
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="flex justify-center space-x-3">
                              <button
                                onClick={() => openReadPopup(book._id)}
                                className="text-blue-600 transition-colors duration-150 hover:text-blue-800"
                              >
                                <BookA size={18} />
                              </button>
                              <button
                                onClick={() => openRecordBookPopup(book._id)}
                                className="text-green-600 transition-colors duration-150 hover:text-green-800"
                              >
                                <NotebookPen size={18} />
                              </button>
                            </div>
                          </td>
                        )}

                        {user?.role === "user" && (
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            {book.availability ? (
                              (() => {
                                const isBorrowed = borrowedBooks?.some(
                                  (b) => b.book._id === book._id && b.returnDate === null
                                );
                                if (isBorrowed) {
                                  return (
                                    <button
                                      disabled
                                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg cursor-not-allowed opacity-60"
                                    >
                                      Already Borrowed
                                    </button>
                                  );
                                } else {
                                  return (
                                    <button
                                      onClick={() => handleBorrow(book._id)}
                                      className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 ${
                                        borrowingBookId === book._id ? "opacity-70" : ""
                                      }`}
                                      disabled={borrowingBookId === book._id && borrowLoading}
                                    >
                                      {borrowingBookId === book._id && borrowLoading ? "Borrowing..." : "Borrow Book"}
                                    </button>
                                  );
                                }
                              })()
                            ) : (
                              <span className="text-sm text-gray-400">Not Available</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analytics Section */}
            {user?.role === "admin" && (
              <>
                {/* Charts Row */}
                <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
                  {/* Quantity Bar Chart */}
                  <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Book Quantities</h3>
                    </div>
                    <div className="h-64">
                      <Bar data={quantityData} options={quantityOptions} />
                    </div>
                  </div>

                  {/* Availability Pie Chart */}
                  <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Book Availability</h3>
                    </div>
                    <div className="h-64">
                      <Pie data={pieData} options={pieOptions} />
                    </div>
                  </div>
                </div>

                {/* Price Analysis */}
                {bookPriceData && (
                  <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Price Analysis</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
                        <p className="mb-1 text-sm font-medium text-green-800">Most Expensive Book</p>
                        <p className="text-lg font-bold text-green-900">{bookPriceData.maxPriceBook.title}</p>
                        <p className="text-sm text-green-700">Rs.{bookPriceData.maxPriceBook.price}</p>
                      </div>
                      <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="mb-1 text-sm font-medium text-blue-800">Most Affordable Book</p>
                        <p className="text-lg font-bold text-blue-900">{bookPriceData.minPriceBook.title}</p>
                        <p className="text-sm text-blue-700">Rs.{bookPriceData.minPriceBook.price}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Most Borrowed Books - Card Layout */}
                {mostBorrowedBooks.length > 0 && (
                  <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Top 5 Most Borrowed Books</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                      {mostBorrowedBooks.map((book, index) => (
                        <div key={book._id} className="relative p-4 transition-shadow duration-200 border border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md">
                          <div className="absolute top-2 right-2">
                            <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-purple-500 rounded-full">
                              {index + 1}
                            </span>
                          </div>
                          <div className="pr-8">
                            <h4 className="mb-2 text-sm font-medium leading-tight text-gray-900">
                              {book.title}
                            </h4>
                            <p className="mb-3 text-xs text-gray-600">by {book.author}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-purple-600">
                                {book.borrowCount} {book.borrowCount === 1 ? 'borrow' : 'borrows'}
                              </span>
                              <span className="text-xs text-gray-500">Rs.{book.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="p-12 bg-white border border-gray-100 shadow-sm rounded-xl">
              <BookA className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-2xl font-medium text-gray-600">No books found</h3>
              <p className="text-gray-500">
                {searchedKeyword ? "Try adjusting your search terms" : "No books available in the library"}
              </p>
            </div>
          </div>
        )}
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;