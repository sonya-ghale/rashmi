import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { login, resetAuthSlice } from "../store/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    dispatch(login(data)).then((res) => {
      if (!res) return;
      if (res.user && !res.user.accountVerified) {
        // redirect to OTP page with email
        navigate("/otp", { state: { email: email } });
      } else if (res.user && res.user.accountVerified) {
        navigate("/"); // verified, go to home
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  if (isAuthenticated && user?.accountVerified) {
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
          <h1 className="text-3xl font-medium mb-6">Welcome Back!!</h1>
          <p className="text-gray-800 text-center mb-8">
            Please enter your credentials to login.
          </p>

          <form onSubmit={handleLogin}>
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
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-black rounded-md w-full px-4 py-3 focus:outline-none focus:ring-0"
                required
              />
            </div>

            <div className="mb-6 text-right">
              <Link
                to="/password/forgot"
                className="font-semibold text-black text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="border-2 border-black w-full font-semibold bg-black text-white py-3 rounded-md hover:bg-white hover:text-black transition duration-300 disabled:opacity-50"
            >
              {loading ? "Processing..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center
        justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
        <div className="text-center">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="h-44 w-auto" />
          </div>
          <p className="text-gray-300 mb-12">New to our platform? Sign up now.</p>
          <Link
            to="/register"
            className="border-2 border-white px-8 font-semibold bg-black text-white py-3 rounded-md hover:bg-white hover:text-black transition duration-300 inline-block"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
