import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Navigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if(message){
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-8 relative">
        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-24 w-auto" />
          </div>
          <h1 className="text-3xl font-medium mb-6">Forgot Password?</h1>
          <p className="text-gray-800 text-center mb-8">
            Please enter your email to receive a password reset link.
          </p>

          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-black rounded-md w-full px-4 py-3 focus:outline-none focus:ring-0"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="border-2 border-black w-full font-semibold bg-black text-white py-3 rounded-md hover:bg-white hover:text-black transition duration-300 disabled:opacity-50"
            >
              {loading ? "Processing..." : "SEND RESET LINK"}
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

      {/* RIGHT SIDE */}
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

export default ForgotPassword;
