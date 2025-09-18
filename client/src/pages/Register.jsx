import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { resetAuthSlice, register } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const navigateTo = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    dispatch(register(data));
  };

  useEffect(() => {
    if (message) {
      navigateTo(`/otp-verification/${email}`);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message, navigateTo, email]);

  if (isAuthenticated) return <Navigate to={"/"} />;

  return (
    <>
      <Helmet>
        <title>Register Page</title>
        <meta name="description" content="Register page" />
      </Helmet>

      <div className="flex flex-col justify-center h-screen md:flex-row">
        {/* LEFT SIDE */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[376px]">
            <div className="flex justify-center mb-12">
              <img
                src={logo_with_title}
                alt="Logo"
                className="w-auto mb-12 h-44"
              />
            </div>
            <p className="mb-12 text-gray-300">
              Already have an account? Sign in now.
            </p>
            <Link
              to={"/login"}
              className="px-8 py-2 font-semibold transition rounded-lg boarder-2 boarder-white hover:bg-white hover:text-black"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center w-full p-8 bg-white md:w-1/2">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-12">
              <div className="flex flex-col-reverse items-center justify-center gap-5 sm:flex-row">
                <h3 className="overflow-hidden text-4xl font-medium">
                  Sign Up
                </h3>
                <img
                  src={logo}
                  alt="logo"
                  className="object-cover w-24 h-auto"
                />
              </div>
            </div>

            <p className="mb-12 text-center text-gray-800">
              Please provide your information to sign up.
            </p>

            <form onSubmit={handleRegister}>
              <div className="mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              <div className="mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              {/* PASSWORD INPUT WITH TOGGLE */}
              <div className="relative mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 border border-black rounded-md focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 flex items-center text-gray-600 right-3"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mt-5 font-semibold bloack md:hidden">
                <p>
                  Already have account?
                  <Link
                    to="/login"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-5 font-semibold text-white transition bg-black border-2 border-black rounded-lg hover:bg-white hover:text-black"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
