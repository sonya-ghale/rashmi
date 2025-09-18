import express from "express";
import {
  recordBorrowedBooks,
  returnBorrowedBooks,
  borrowedBooks,
  getBorrowedBooksForAdmin,
} from "../controllers/borrowController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User/Admin can borrow book
router.post(
  "/record-borrow-book/:id",
  isAuthenticated,
  isAuthorized("admin", "user"),
  recordBorrowedBooks
);

// Admin/User can see all borrow records
router.get(
  "/borrowed-books-by-users",
  isAuthenticated,
  isAuthorized("admin", "user"),
  getBorrowedBooksForAdmin
);

// User's own borrow history
router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);

// Return a borrowed book
router.put(
  "/return-borrowed-book/:id",
  isAuthenticated,
  isAuthorized("admin", "user"),
  returnBorrowedBooks
);

export default router;
