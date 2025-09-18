import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import { fetchAllUsers } from "../store/slices/userSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";
import {
  BookOpen,
  Users,
  Download,
  CheckCircle,
  Shield,
  BarChart3,
  PieChart,
  Calendar,
  Eye,
  Clock,
} from "lucide-react";

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
import Header from "../layout/Header";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Fetch all data
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { borrowedBooks } = useSelector((state) => state.borrow);

  // Stats
  const totalBooks = books?.length || 0;
  const totalStudents = users?.filter((u) => u.role === "user").length || 0;
  const totalBorrowedBooks = borrowedBooks?.length || 0;
  const totalCurrentlyBorrowedBooks =
    borrowedBooks?.filter((b) => !b.returnDate).length || 0;
  const totalReturnedBooks =
    borrowedBooks?.filter((b) => b.returnDate).length || 0;
  const activeAdmins = users?.filter((u) => u.role === "admin").length || 0;

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    const borrowCount = Array(12).fill(0);
    const returnCount = Array(12).fill(0);

    borrowedBooks?.forEach((b) => {
      const borrowMonth = new Date(b.borrowDate).getMonth();
      borrowCount[borrowMonth] += 1;

      if (b.returnDate) {
        const returnMonth = new Date(b.returnDate).getMonth();
        returnCount[returnMonth] += 1;
      }
    });

    return { borrowCount, returnCount };
  }, [borrowedBooks]);

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
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

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 12 } },
      },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: { color: "#6b7280", font: { size: 12 } },
      },
    },
  };

  // Pie chart for book overview
  const availableBooks = books?.filter((b) => b.availability).length || 0;
  const unavailableBooks = totalBooks - availableBooks;

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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 8,
      },
    },
  };

  // Stats cards configuration
  const statsCards = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      changeType: "positive",
    },
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      changeType: "positive",
    },
    {
      title: "Total Borrowed",
      value: totalBorrowedBooks,
      icon: Download,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      changeType: "positive",
    },
    {
      title: "Currently Borrowed",
      value: totalCurrentlyBorrowedBooks,
      icon: Clock,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      changeType: "negative",
    },
    {
      title: "Returned Books",
      value: totalReturnedBooks,
      icon: CheckCircle,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      changeType: "positive",
    },
    {
      title: "Active Admins",
      value: activeAdmins,
      icon: Shield,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      changeType: "neutral",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
        <meta
          name="description"
          content="Admin Dashboard - Library Management System"
        />
      </Helmet>

      <main className="relative flex-1 min-h-screen px-6 pb-8 pt-28 bg-gray-50">
        <Header />

        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Overview of library statistics and recent activities
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-8 mb-8 xl:grid-cols-3">
          {/* Monthly Transaction Chart */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm xl:col-span-2 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Monthly Transaction Report
                </h3>
                <p className="text-sm text-gray-600">
                  Borrowed vs Returned books throughout the year
                </p>
              </div>
            </div>
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Book Overview */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <PieChart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Book Availability
                </h3>
                <p className="text-sm text-gray-600">Current status overview</p>
              </div>
            </div>
            <div className="h-64 mb-6">
              <Pie data={pieData} options={pieOptions} />
            </div>

            {/* Quick Stats */}
            <div className="pt-4 space-y-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Available Books
                </span>
                <span className="text-sm font-bold text-green-600">
                  {availableBooks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Unavailable Books
                </span>
                <span className="text-sm font-bold text-red-600">
                  {unavailableBooks}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-sm font-semibold text-gray-900">
                  Total Books
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {totalBooks}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Books Overview */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Books Overview
                </h3>
                <p className="text-sm text-gray-600">
                  Latest additions to the library
                </p>
              </div>
            </div>
            <button className="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800">
              View All
            </button>
          </div>

          {books?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {books.slice(0, 6).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">No books available</p>
              <p className="text-sm text-gray-400">
                Add some books to get started
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

// Enhanced StatCard Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  textColor,
}) => (
  <div
    className={`${bgColor} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`${color} p-3 rounded-lg shadow-sm`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div>
      <p className="mb-1 text-2xl font-bold text-gray-900">{value}</p>
      <p className={`text-sm font-medium ${textColor}`}>{title}</p>
    </div>
  </div>
);

// BookCard Component
const BookCard = ({ book }) => (
  <div className="p-4 transition-shadow duration-200 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-sm">
    <div className="flex items-start justify-between mb-3">
      <h4 className="text-sm font-medium leading-tight text-gray-900 line-clamp-2">
        {book.title}
      </h4>
      <span
        className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          book.availability
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {book.availability ? "Available" : "Unavailable"}
      </span>
    </div>
    <p className="mb-3 text-xs text-gray-600">by {book.author}</p>
    <div className="flex items-center justify-between">
      <div className="text-xs text-gray-500">
        <span className="font-medium">Qty:</span> {book.quantity}
      </div>
      <div className="text-sm font-semibold text-gray-900">Rs.{book.price}</div>
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
  change: PropTypes.string,
  changeType: PropTypes.oneOf(["positive", "negative", "neutral"]),
};

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    availability: PropTypes.bool.isRequired,
  }).isRequired,
};

export default AdminDashboard;
