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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  // const { user } = useSelector((state) => state.auth);
  const { borrowedBooks } = useSelector((state) => state.borrow);
  const { books } = useSelector((state) => state.book);

  // Real-time values
  const totalBorrowed = borrowedBooks?.length || 0;
  const toReturn = borrowedBooks?.filter((b) => !b.returnDate).length || 0;
  const totalInventory = books?.length || 0;

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

  // role color
  // const roleColor =
  //   user?.role === "admin"
  //     ? { color: "red" }
  //     : user?.role === "user"
  //     ? { color: "gold" }
  //     : { color: "gray" };

  return (
    <>
      <Header />
      <div
        style={{
          padding: "100px 20px 20px", // top padding for header
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
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "#3b82f6",
              padding: "20px",
              borderRadius: "10px",
              color: "white",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "40px", fontWeight: "bold" }}>
              {totalBorrowed}
            </span>
            <p>Total Borrowed</p>
          </div>
          <div
            style={{
              background: "#f59e0b",
              padding: "20px",
              borderRadius: "10px",
              color: "white",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "40px", fontWeight: "bold" }}>
              {toReturn}
            </span>
            <p>Books To Return</p>
          </div>
          <div
            style={{
              background: "#10b981",
              padding: "20px",
              borderRadius: "10px",
              color: "white",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "40px", fontWeight: "bold" }}>
              {totalInventory}
            </span>
            <p>Book Inventory</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h2>Monthly Transaction Report</h2>
            <Bar data={data} options={options} />
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h2>Books Due Soon</h2>
            <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
              {borrowedBooks
                ?.filter((b) => !b.returnDate)
                .slice(0, 6)
                .map((book) => (
                  <li
                    key={book._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <span>{book.book?.title || "Unknown"}</span>
                    <span style={{ color: "red", fontSize: "14px" }}>
                      {new Date(book.dueDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              {toReturn === 0 && (
                <p style={{ color: "#666", textAlign: "center" }}>
                  No pending returns!
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
