import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import Header from "../layout/Header";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Eye,
  User
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { borrowedBooks } = useSelector((state) => state.borrow);
  const { books } = useSelector((state) => state.book);

  // Real-time values
  const totalBorrowed = borrowedBooks?.length || 0;
  const toReturn = borrowedBooks?.filter((b) => !b.returnDate).length || 0;
  const totalInventory = books?.length || 0;
  const returned = borrowedBooks?.filter((b) => b.returnDate).length || 0;

  // Monthly data
  const monthlyData = useMemo(() => {
    const borrowCount = Array(12).fill(0);
    const returnCount = Array(12).fill(0);

    borrowedBooks?.forEach((book) => {
      const borrowMonth = new Date(book.borrowDate).getMonth();
      borrowCount[borrowMonth] += 1;

      if (book.returnDate) {
        const returnMonth = new Date(book.returnDate).getMonth();
        returnCount[returnMonth] += 1;
      }
    });

    return { borrowCount, returnCount };
  }, [borrowedBooks]);

  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Borrowed",
        data: monthlyData.borrowCount,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Returned",
        data: monthlyData.returnCount,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 14 }
        }
      },
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
        ticks: { color: '#6b7280', font: { size: 12 } }
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#6b7280', font: { size: 12 } }
      }
    }
  };

  // Stats cards configuration
  const statsCards = [
    {
      title: "Total Borrowed",
      value: totalBorrowed,
      icon: BookOpen,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      description: "All time borrows"
    },
    {
      title: "Books to Return",
      value: toReturn,
      icon: Clock,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      description: "Pending returns"
    },
    {
      title: "Books Returned",
      value: returned,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      description: "Successfully returned"
    },
    {
      title: "Library Inventory",
      value: totalInventory,
      icon: Eye,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      description: "Available books"
    },
  ];

  // Get overdue books
  const currentDate = new Date();
  const overdueBooks = borrowedBooks?.filter((b) => 
    !b.returnDate && new Date(b.dueDate) <= currentDate
  ) || [];

  // Get due soon books (next 7 days)
  const dueSoonBooks = borrowedBooks?.filter((b) => {
    if (b.returnDate) return false;
    const dueDate = new Date(b.dueDate);
    const daysDiff = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 && daysDiff <= 7;
  }) || [];

  return (
    <>
      <Helmet>
        <title>My Dashboard</title>
        <meta name="description" content="User Dashboard - Library Management System" />
      </Helmet>
      
      <main className="relative flex-1 min-h-screen px-6 pb-8 pt-28 bg-gray-50">
        <Header />
        
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Here s your reading activity and library overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="font-medium text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2024"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Section - Overdue Books */}
        {overdueBooks.length > 0 && (
          <div className="p-4 mb-8 border border-red-200 bg-red-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Overdue Books Alert</h3>
                <p className="text-sm text-red-700">
                  You have {overdueBooks.length} overdue book{overdueBooks.length > 1 ? 's' : ''}. Please return them as soon as possible.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Monthly Transaction Chart */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm xl:col-span-2 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">My Reading Activity</h3>
                <p className="text-sm text-gray-600">Your borrowing and returning patterns throughout the year</p>
              </div>
            </div>
            <div className="h-80">
              <Bar data={data} options={options} />
            </div>
          </div>

          {/* Books Status Panel */}
          <div className="space-y-6">
            {/* Due Soon Books */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Due Soon</h3>
                  <p className="text-sm text-gray-600">Books due in next 7 days</p>
                </div>
              </div>
              
              {dueSoonBooks.length > 0 ? (
                <div className="space-y-3">
                  {dueSoonBooks.slice(0, 4).map((book) => (
                    <BookItem 
                      key={book._id} 
                      book={book} 
                      dueDate={book.dueDate}
                      status="due-soon"
                    />
                  ))}
                  {dueSoonBooks.length > 4 && (
                    <p className="pt-2 text-sm text-center text-gray-500">
                      +{dueSoonBooks.length - 4} more books
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm text-gray-500">No books due soon!</p>
                </div>
              )}
            </div>

            {/* Current Books */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Currently Reading</h3>
                  <p className="text-sm text-gray-600">Your active borrowed books</p>
                </div>
              </div>
              
              {toReturn > 0 ? (
                <div className="space-y-3">
                  {borrowedBooks
                    ?.filter((b) => !b.returnDate)
                    .slice(0, 3)
                    .map((book) => (
                      <BookItem 
                        key={book._id} 
                        book={book} 
                        dueDate={book.dueDate}
                        status="current"
                      />
                    ))}
                  {toReturn > 3 && (
                    <p className="pt-2 text-sm text-center text-gray-500">
                      +{toReturn - 3} more books
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">No books currently borrowed</p>
                  <p className="text-xs text-gray-400">Visit the library to borrow books</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// Enhanced StatCard Component
const StatCard = ({ title, value, icon: Icon, color, bgColor, textColor, description }) => (
  <div className={`${bgColor} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`${color} p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <TrendingUp className="w-4 h-4 text-gray-400" />
    </div>
    <div>
      <p className="mb-1 text-3xl font-bold text-gray-900">{value}</p>
      <p className={`text-sm font-medium ${textColor} mb-1`}>{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// BookItem Component
const BookItem = ({ book, dueDate }) => {
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);
  const isOverdue = dueDateObj <= currentDate;
  const daysDiff = Math.ceil((dueDateObj - currentDate) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="flex items-center justify-between p-3 transition-colors duration-150 rounded-lg bg-gray-50 hover:bg-gray-100">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {book.book?.title || "Unknown Book"}
        </h4>
        <p className="text-xs text-gray-500">
          by {book.book?.author || "Unknown Author"}
        </p>
      </div>
      <div className="ml-4 text-right">
        <p className={`text-xs font-medium ${
          isOverdue ? 'text-red-600' : 
          daysDiff <= 3 ? 'text-amber-600' : 'text-gray-600'
        }`}>
          {isOverdue ? 'Overdue' : 
           daysDiff === 0 ? 'Due today' :
           daysDiff === 1 ? 'Due tomorrow' :
           `${daysDiff} days left`}
        </p>
        <p className="text-xs text-gray-400">
          {dueDateObj.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

BookItem.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string,
    book: PropTypes.shape({
      title: PropTypes.string,
      author: PropTypes.string,
    })
  }).isRequired,
  dueDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default UserDashboard;