import express from "express";
import {
    register, login, logout, verifyOTP, getUser,
    forgotPassword, resetPassword, updatePassword
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

export default router;