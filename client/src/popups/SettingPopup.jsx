import React, { useState, useEffect } from "react";
import closeIcon from "../assets/close-square.png";
import settingIcon from "../assets/setting.png";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../store/slices/authSlice";
import { toggleSettingPopup } from "../store/slices/popUpSlice";

const SettingPopup = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      // If password update was successful, close the popup
      dispatch(toggleSettingPopup());
    }
  }, [message, dispatch]);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setLocalError("");

    // Check all fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      setLocalError("Please provide all fields!");
      return;
    }

    // Check new passwords match
    if (newPassword !== confirmPassword) {
      setLocalError("New passwords do not match!");
      return;
    }

    // Check password strength
    if (newPassword.length < 6 || newPassword.length > 20) {
      setLocalError("Password must be between 6 to 20 characters!");
      return;
    }

    // Send JSON data to thunk - using confirmPassword (not confirmNewPassword)
    const data = {
      currentPassword,
      newPassword,
      confirmPassword, // Changed to match backend expectation
    };

    dispatch(updatePassword(data));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <img src={settingIcon} alt="setting-icon" className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Change Credentials</h3>
          </div>
          <img
            src={closeIcon}
            alt="close-icon"
            className="w-6 h-6 cursor-pointer"
            onClick={() => dispatch(toggleSettingPopup())}
          />
        </header>

        {localError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {localError}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          {/* Current Password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="w-full sm:w-1/3 text-gray-900 font-medium">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="w-full sm:w-1/3 text-gray-900 font-medium">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="w-full sm:w-1/3 text-gray-900 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => dispatch(toggleSettingPopup())}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "CONFIRM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingPopup;