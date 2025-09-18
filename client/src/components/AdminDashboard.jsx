import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import { fetchAllUsers } from "../store/slices/userSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";

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
import Header from "../layout/Header";
import { Helmet } from "react-helmet-async";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Fetch data
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { borrowedBooks } = useSelector((state) => state.borrow);

  // Stats calculations
  const totalBooks = books?.length || 0;
  const totalStudents = users?.filter((u) => u.role === "user").length || 0;
  const totalBorrowedBooks = borrowedBooks?.length || 0; // total borrowed books
  const totalCurrentlyBorrowedBooks =
    borrowedBooks?.filter((b) => !b.returnDate).length || 0; // currently borrowed
  const totalReturnedBooks =
    borrowedBooks?.filter((b) => b.returnDate).length || 0;
  const activeAdmins = users?.filter((u) => u.role === "admin").length || 0;

  // Monthly data for chart
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

  const data = {
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
        backgroundColor: "rgba(59,130,246,0.8)", // blue
      },
      {
        label: "Returned",
        data: monthlyData.returnCount,
        backgroundColor: "rgba(16,185,129,0.8)", // green
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin Dashboard" />
      </Helmet>
      <Header />
      <div
        style={{
          padding: "100px 20px 20px",
          background: "#f5f5f5",
          minHeight: "100vh",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Top Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div style={cardStyle("#3b82f6")}>
            <span style={cardNumberStyle}>{totalBooks}</span>
            <p>Total Books</p>
          </div>
          <div style={cardStyle("#10b981")}>
            <span style={cardNumberStyle}>{totalStudents}</span>
            <p>Total Students</p>
          </div>
          <div style={cardStyle("#f59e0b")}>
            <span style={cardNumberStyle}>{totalBorrowedBooks}</span>
            <p>Total Borrowed Books</p>
          </div>
          <div style={cardStyle("#f97316")}>
            <span style={cardNumberStyle}>{totalCurrentlyBorrowedBooks}</span>
            <p>Currently Borrowed</p>
          </div>
          <div style={cardStyle("#6366f1")}>
            <span style={cardNumberStyle}>{totalReturnedBooks}</span>
            <p>Returned Books</p>
          </div>
          <div style={cardStyle("#ef4444")}>
            <span style={cardNumberStyle}>{activeAdmins}</span>
            <p>Active Admins</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
          }}
        >
          {/* Chart */}
          <div style={panelStyle}>
            <h2>Monthly Transaction Report</h2>
            <Bar data={data} options={options} />
          </div>

          {/* Books Overview */}
          <div style={panelStyle}>
            <h2>Books Overview</h2>
            <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
              {books?.slice(0, 6).map((book) => (
                <li key={book._id} style={bookItemStyle}>
                  <span>{book.title}</span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: book.availability ? "green" : "red",
                    }}
                  >
                    {book.availability
                      ? `Available (${book.quantity})`
                      : "Unavailable"}
                  </span>
                </li>
              ))}
              {books?.length === 0 && (
                <p style={{ color: "#666", textAlign: "center" }}>
                  No books available
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

// Styles
const cardStyle = (bgColor) => ({
  background: bgColor,
  padding: "20px",
  borderRadius: "10px",
  color: "white",
  textAlign: "center",
});

const cardNumberStyle = { fontSize: "40px", fontWeight: "bold" };
const panelStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
};
const bookItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #ddd",
};

export default AdminDashboard;
