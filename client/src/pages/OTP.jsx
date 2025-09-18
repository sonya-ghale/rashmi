import  { useEffect, useState } from "react";
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
    <div className="flex flex-col h-screen md:flex-row">
      {/* LEFT SIDE */}
      <div className="relative flex flex-col items-center justify-center w-full p-8 bg-white md:w-1/2">
        <Link
          to={"/login"}
          className="absolute w-24 px-4 py-2 font-bold text-center duration-300 border-2 border-black rounded-3xl top-10 left-10 hover:bg-black hover:text-white"
        >
          Back
        </Link>

        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="w-auto h-24" />
          </div>
          <h1 className="mb-6 text-3xl font-medium">Check Your Mailbox</h1>
          <p className="mb-12 text-center text-gray-800">
            Please enter the OTP sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleOtpVerification} className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} // Only numbers, max 6 digits
              className="w-64 px-4 py-2 mb-4 text-xl tracking-widest text-center border rounded-lg"
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
            <p className="text-sm text-gray-600">
              Didnt receive the OTP?{" "}
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
            <img src={logo_with_title} alt="logo" className="w-auto mb-12 h-44"/>
          </div>
          <p className="mb-12 text-gray-300">New to our platform? Sign up now.</p>
          <Link
            to={"/register"}                 
            className="w-full px-8 py-2 mt-5 font-semibold text-white transition bg-black border-2 border-white rounded-lg hover:bg-white hover:text-black"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTP;