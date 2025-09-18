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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { borrows } = useSelector((state) => state.borrow);

  // ✅ Stats
  const totalBooks = books?.length || 0;
  const totalStudents = users?.filter((u) => u.role === "user").length || 0;
  const borrowedBooks = borrows?.filter((b) => !b.returned).length || 0;
  const returnedBooks = borrows?.filter((b) => b.returned).length || 0;
  const activeAdmins = users?.filter((u) => u.role === "admin").length || 0;

  // ✅ Monthly data
  const monthlyData = useMemo(() => {
    const borrowCount = Array(12).fill(0);
    const returnCount = Array(12).fill(0);

    borrows?.forEach((b) => {
      const borrowMonth = new Date(b.borrowDate).getMonth();
      borrowCount[borrowMonth] += 1;

      if (b.returned && b.returnDate) {
        const returnMonth = new Date(b.returnDate).getMonth();
        returnCount[returnMonth] += 1;
      }
    });

    return { borrowCount, returnCount };
  }, [borrows]);

  const data = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
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
      <Header />
      <div
        style={{
          padding: "100px 20px 20px", // ✅ keeps space for header
          background: "#f5f5f5",
          minHeight: "100vh",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Top Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          <div style={{ background: "#3b82f6", padding: "20px", borderRadius: "10px", color: "white", textAlign: "center" }}>
            <span style={{ fontSize: "40px", fontWeight: "bold" }}>{totalBooks}</span>
            <p>Total Books</p>
          </div>
          <div style={{ background: "#10b981", padding: "20px", borderRadius: "10px", color: "white", textAlign: "center" }}>
            <span style={{ fontSize: "40px", fontWeight: "bold" }}>{totalStudents}</span>
            <p>Total Students</p>
          </div>
          <div style={{ background: "#f59e0b", padding: "20px", borderRadius: "10px", color: "white", textAlign: "center" }}>
            <span style={{ fontSize: "40px", fontWeight: "bold" }}>{borrowedBooks}</span>
            <p>Borrowed Books</p>
          </div>
          <div style={{ background: "#6366f1", padding: "20px", borderRadius: "10px", color: "white", textAlign: "center" }}>
            <span style={{ fontSize: "40px", fontWeight: "bold" }}>{returnedBooks}</span>
            <p>Returned Books</p>
          </div>
          <div style={{ background: "#ef4444", padding: "20px", borderRadius: "10px", color: "white", textAlign: "center" }}>
            <span style={{ fontSize: "40px", fontWeight: "bold" }}>{activeAdmins}</span>
            <p>Active Admins</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", width: "100%" }}>
          {/* Chart */}
          <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
            <h2>Monthly Transaction Report</h2>
            <Bar data={data} options={options} />
          </div>

          {/* Books Overview */}
          <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
            <h2>Books Overview</h2>
            <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
              {books?.slice(0, 6).map((book) => (
                <li
                  key={book._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <span>{book.title}</span>
                  <span style={{ fontSize: "14px", color: book.isBorrowed ? "red" : "green" }}>
                    {book.isBorrowed ? "Borrowed" : "Available"}
                  </span>
                </li>
              ))}
              {books?.length === 0 && (
                <p style={{ color: "#666", textAlign: "center" }}>No books available</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
