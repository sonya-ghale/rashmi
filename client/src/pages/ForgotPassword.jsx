import  { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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
    <div className="flex flex-col h-screen md:flex-row">
          <Helmet>
            <title>Forgot Password</title>
            <meta name="description" content="Forgot Password" />
          </Helmet>
      {/* LEFT SIDE */}
      <div className="relative flex flex-col items-center justify-center w-full p-8 bg-white md:w-1/2">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="w-auto h-24" />
          </div>
          <h1 className="mb-6 text-3xl font-medium">Forgot Password?</h1>
          <p className="mb-8 text-center text-gray-800">
            Please enter your email to receive a password reset link.
          </p>

          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-0"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white transition duration-300 bg-black border-2 border-black rounded-md hover:bg-white hover:text-black disabled:opacity-50"
            >
              {loading ? "Processing..." : "SEND RESET LINK"}
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm font-semibold text-black hover:underline"
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
            <img src={logo_with_title} alt="logo" className="w-auto mb-12 h-44" />
          </div>
          <p className="mb-12 text-gray-300">Remember your password? Login now.</p>
          <Link
            to="/login"
            className="w-full px-8 py-2 mt-5 font-semibold text-white transition bg-black border-2 border-white rounded-lg hover:bg-white hover:text-black"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
