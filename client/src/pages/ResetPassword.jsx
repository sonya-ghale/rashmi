import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, Navigate } from "react-router-dom";
import { resetPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();
    const data = { password, confirmPassword };
    dispatch(resetPassword(data, token));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* LEFT PANEL */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-24 w-auto" />
          </div>
          <h1 className="text-3xl font-medium mb-6">Reset Password</h1>
          <p className="text-gray-800 mb-8">
            Enter your new password below to reset your account password.
          </p>

          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black rounded-md w-full px-4 py-3 mb-4 focus:outline-none focus:ring-0"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-black rounded-md w-full px-4 py-3 mb-6 focus:outline-none focus:ring-0"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="border-2 border-black w-full font-semibold bg-black text-white py-3 rounded-md hover:bg-white hover:text-black transition duration-300 disabled:opacity-50"
            >
              {loading ? "Processing..." : "RESET PASSWORD"}
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="font-semibold text-black text-sm hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
        <div className="text-center h-[400px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
          </div>
          <p className="text-gray-300 mb-12">Remember your password? Login now.</p>
          <Link
            to="/login"
            className="border-2 mt-5 border-white px-8 w-full font-semibold bg-black text-white py-2 rounded-lg
            hover:bg-white hover:text-black transition"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;