import React, { useEffect, useState } from "react";
import { useLocation, Navigate, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";

const OTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Get email from location state or params
  const emailFromState = location.state?.email;
  const emailFromParams = location.pathname.split("/")[2]; // Get email from URL params
  const email = emailFromState || emailFromParams;

  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing. Please try the process again.");
      navigate("/login");
    }
  }, [email, navigate]);

  const handleOtpVerification = (e) => {
    e.preventDefault();
    if (!email || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      
      // Add a small delay before redirecting to show the success message
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [dispatch, error, message, navigate]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-8 relative">
        <Link
          to={"/login"}
          className="border-2 border-black rounded-3xl font-bold w-24 py-2 px-4 absolute top-10 left-10
              hover:bg-black hover:text-white duration-300 text-center"
        >
          Back
        </Link>

        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-24 w-auto" />
          </div>
          <h1 className="text-3xl font-medium mb-6">Check Your Mailbox</h1>
          <p className="text-gray-800 text-center mb-12">
            Please enter the OTP sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleOtpVerification} className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} // Only numbers, max 6 digits
              className="border rounded-lg px-4 py-2 mb-4 w-64 text-center text-xl tracking-widest"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className={`border-2 mt-5 border-black w-full font-semibold py-2 rounded-lg transition
                ${loading || otp.length < 4 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-white hover:text-black'}`}
            >
              {loading ? 'VERIFYING...' : 'VERIFY OTP'}
            </button>
          </form>
          
          <div className="mt-6">
            <p className="text-gray-600 text-sm">
              Didn't receive the OTP?{" "}
              <button 
                className="text-blue-600 hover:underline"
                onClick={() => toast.info("Resend functionality would go here")}
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center
        justify-center p-8 rounded-tl-[80px] rounded-tr-[80px]">
        <div className="text-center h-[400px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto"/>
          </div>
          <p className="text-gray-300 mb-12">New to our platform? Sign up now.</p>
          <Link
            to={"/register"}                 
            className="border-2 mt-5 border-white px-8 w-full font-semibold bg-black text-white py-2 rounded-lg
              hover:bg-white hover:text-black transition"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTP;