import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errormiddlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return next(new ErrorHandler("User not found.", 404));
    }

    // ✅ Now req.user will always have email
    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token.", 401));
  }
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `(${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
