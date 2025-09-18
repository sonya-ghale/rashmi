import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Sidebar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Always normalize role to lowercase
  const role = user?.role?.toLowerCase();

  return (
    <div className="relative flex min-h-screen bg-gray-100 md:pl-64">
          <Helmet>
            <title>Home Page</title>
            <meta name="description" content="Home Page" />
          </Helmet>
      {/* Hamburger Menu for mobile */}
      <div
        className="absolute z-10 flex items-center justify-center text-white bg-black rounded-md md:hidden right-6 top-4 sm:top-6 h-9 w-9"
      >
        <GiHamburgerMenu
          className="text-2xl"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={setSelectedComponent}
      />

      {/* Render Components */}
      {(() => {
        switch (selectedComponent) {
          case "Dashboard":
            return role === "user" ? <UserDashboard /> : <AdminDashboard />;

          case "Books":
            return <BookManagement />;

          case "Catalog":
            return role === "admin" ? <Catalog /> : null;

          case "Users":
            return role === "admin" ? <Users /> : null;

          case "My Borrowed Books":
            return <MyBorrowedBooks />;

          default:
            return role === "user" ? <UserDashboard /> : <AdminDashboard />;
        }
      })()}
    </div>
  );
};

export default Home;
