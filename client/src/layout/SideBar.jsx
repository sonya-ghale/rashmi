import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
} from "../store/slices/popUpSlice";
import { logout, resetAuthSlice } from "../store/slices/authSlice";

import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";

import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup } = useSelector(
    (state) => state.popup
  );
  const { user, isAuthenticated, error, message, loading } = useSelector(
    (state) => state.auth
  );

  // Show loading if auth is still loading
  if (loading) return <div className="p-4 text-center">Loading...</div>;

  // If user is not authenticated yet, show a message
  if (!isAuthenticated || !user)
    return <div className="p-4 text-center">Please login to see the menu</div>;

  const handleLogout = () => {
    dispatch(logout());
  };

  if (error) {
    toast.error(error);
    dispatch(resetAuthSlice());
  }

  if (message) {
    toast.success(message);
    dispatch(resetAuthSlice());
  }

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:left-0 flex w-64 
  text-white flex-col h-full 
  bg-gradient-to-b from-gray-800 via-gray-900 to-black`}
        style={{ position: "fixed" }}
      >
        {/* Logo */}
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="Logo" />
        </div>

        {/* Menu */}
        <nav className="flex-1 px-6 space-y-2">
          <button
            className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>

          <button
            className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>

          {user?.role === "admin" ? (
            <button
              className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
              onClick={() => setSelectedComponent("Catalog")}
            >
              <img src={catalogIcon} alt="icon" />
              <span>Catalog</span>
            </button>
          ) : (
            <button
              className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
              onClick={() => setSelectedComponent("My Borrowed Books")}
            >
              <img src={catalogIcon} alt="icon" />
              <span>My Borrowed Books</span>
            </button>
          )}

          {/* Admin-only options */}
          {user?.role === "admin" && (
            <>
              <button
                className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={usersIcon} alt="icon" />
                <span>Users</span>
              </button>

              <button
                className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Add New Admin</span>
              </button>
            </>
          )}

          <button
            className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={settingIcon} alt="icon" />
            <span>Update Credentials</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="px-6 py-4">
          <button
            className="py-2 font-medium flex items-center justify-center space-x-5 mx-auto w-fit hover:cursor-pointer"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="icon" />
            <span>Logout</span>
          </button>
        </div>

        {/* Close Icon for mobile */}
        <img
          src={closeIcon}
          alt="icon"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden cursor-pointer"
        />
      </aside>

      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;
