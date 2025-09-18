import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff } from "lucide-react"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

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
        navigate("/otp", { state: { email: email } });
      } else if (res.user && res.user.accountVerified) {
        navigate("/");
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
    <div className="flex flex-col h-screen md:flex-row">
      <Helmet>
        <title>Login Page</title>
        <meta name="description" content="Login Page" />
      </Helmet>

      {/* LEFT SIDE */}
      <div className="relative flex flex-col items-center justify-center w-full p-8 bg-white md:w-1/2">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="w-auto h-24" />
          </div>
          <h1 className="mb-6 text-3xl font-medium">Welcome Back!!</h1>
          <p className="mb-8 text-center text-gray-800">
            Please enter your credentials to login.
          </p>

          <form onSubmit={handleLogin}>
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

            {/* PASSWORD WITH TOGGLE */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-black rounded-md focus:outline-none focus:ring-0"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 flex items-center text-gray-600 right-3"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mb-6 text-right">
              <Link
                to="/password/forgot"
                className="text-sm font-semibold text-black"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white transition duration-300 bg-black border-2 border-black rounded-md hover:bg-white hover:text-black disabled:opacity-50"
            >
              {loading ? "Processing..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
        <div className="text-center">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="w-auto h-44" />
          </div>
          <p className="mb-12 text-gray-300">New to our platform? Sign up now.</p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 font-semibold text-white transition duration-300 bg-black border-2 border-white rounded-md hover:bg-white hover:text-black"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
