// src/pages/MyBorrowedBooks.jsx
import { useState, useEffect } from "react";
import { BookOpen, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice"; 
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";
import { Helmet } from "react-helmet-async";

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

  // Check if book is overdue
  const isOverdue = (dueDate, returnDate) => {
    if (returnDate) return false; // Already returned
    return new Date(dueDate) < new Date();
  };

  // Filter books based on active tab
  const displayedBooks = userBorrowedBooks?.filter((b) => {
    if (activeTab === "returned") return b.returnDate !== null;
    if (activeTab === "non-returned") return b.returnDate === null;
    return true; // all
  });

  // Get counts for tabs
  const allCount = userBorrowedBooks?.length || 0;
  const returnedCount = userBorrowedBooks?.filter(b => b.returnDate).length || 0;
  const nonReturnedCount = userBorrowedBooks?.filter(b => !b.returnDate).length || 0;
  const overdueCount = userBorrowedBooks?.filter(b => isOverdue(b.dueDate, b.returnDate)).length || 0;

  const tabConfigs = [
    {
      id: "all",
      label: "All Books",
      count: allCount,
      icon: BookOpen,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      activeColor: "bg-blue-500",
      inactiveColor: "bg-gray-100 hover:bg-gray-200",
      textColor: "text-blue-600",
    },
    {
      id: "returned",
      label: "Returned",
      count: returnedCount,
      icon: CheckCircle2,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      activeColor: "bg-green-500",
      inactiveColor: "bg-gray-100 hover:bg-gray-200",
      textColor: "text-green-600",
    },
    {
      id: "non-returned",
      label: "Active",
      count: nonReturnedCount,
      icon: Clock,
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600",
      activeColor: "bg-amber-500",
      inactiveColor: "bg-gray-100 hover:bg-gray-200",
      textColor: "text-amber-600",
    },
  ];

  return (
    <>
      <Helmet>
        <title>My Borrowed Books</title>
        <meta name="description" content="My Borrowed Books - Library Management" />
      </Helmet>
      
      <main className="relative flex-1 min-h-screen px-6 pb-8 pt-28 bg-gray-50">
        <Header />

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                My Borrowed Books
              </h1>
              <p className="text-gray-600">
                Track your reading history and manage borrowed books
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <BookOpen className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{allCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Overdue Books</h3>
                <p className="text-sm text-red-700">
                  You have {overdueCount} overdue book{overdueCount > 1 ? 's' : ''}. Please return them as soon as possible.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {tabConfigs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? `${tab.activeColor} text-white shadow-md transform scale-105` 
                    : `${tab.inactiveColor} ${tab.textColor} hover:scale-102`
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-600">Loading your books...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-6 mb-6 border border-red-200 bg-red-50 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Error Loading Books</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Table */}
        {displayedBooks && displayedBooks.length > 0 ? (
          <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      #
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      Book Details
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      Borrowed Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedBooks.map((borrow, index) => {
                    const overdue = isOverdue(borrow.dueDate, borrow.returnDate);
                    
                    return (
                      <tr key={index} className="transition-colors duration-150 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {borrow.book?.title || "Unknown Title"}
                              </div>
                              <div className="text-sm text-gray-600">
                                by {borrow.book?.author || "Unknown Author"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            <div className="font-medium">
                              {formatDate(borrow.borrowDate)?.split(' ')[0]}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(borrow.borrowDate)?.split(' ')[1]}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            <div className={`font-medium ${overdue ? 'text-red-600' : ''}`}>
                              {formatDate(borrow.dueDate)?.split(' ')[0]}
                            </div>
                            <div className={`text-xs ${overdue ? 'text-red-400' : 'text-gray-400'}`}>
                              {formatDate(borrow.dueDate)?.split(' ')[1]}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {borrow.returnDate ? (
                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Returned
                            </span>
                          ) : overdue ? (
                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Overdue
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Active
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {borrow.book?.id ? (
                            <button
                              onClick={() => openReadPopup(borrow.book)}
                              className="inline-flex items-center justify-center w-8 h-8 transition-colors duration-200 bg-blue-100 rounded-full hover:bg-blue-200 group"
                              title="View book details"
                            >
                              <Eye className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="py-20 text-center">
              <div className="p-12 bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-medium text-gray-600">
                  No books found
                </h3>
                <p className="text-gray-500">
                  {activeTab === "all" && "You haven't borrowed any books yet"}
                  {activeTab === "returned" && "You haven't returned any books yet"}
                  {activeTab === "non-returned" && "You don't have any active borrowed books"}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Visit the library to start borrowing books
                </p>
              </div>
            </div>
          )
        )}
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;