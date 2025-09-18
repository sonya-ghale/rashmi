import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errormiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const recordBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // book id
  const { _id, name, email } = req.user;  // 👈 take directly from req.user
  console.log("DEBUG USER OBJECT:", req.user);

  if (!email) {
    return next(new ErrorHandler("User email not found.", 400));
  }

  const book = await Book.findById(id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book is not available", 400));
  }

  // stock update
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrowDate = new Date();
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // ✅ directly save with email
  await Borrow.create({
    user: { id: _id, name, email },
    book: { id: book._id, title: book.title, author: book.author },
    price: book.price,
    borrowDate,
    dueDate,
    returnDate: null,
  });

  res.status(201).json({
    success: true,
    message: "Book borrowed successfully.",
  });
});


// 📌 Return a borrowed book
export const returnBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { id: bookId } = req.params;
  const email = req.user?.email;

  if (!email) return next(new ErrorHandler("User email not found.", 400));

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );
  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }

  borrowedBook.returned = true;
  borrowedBook.returnDate = new Date();
  await user.save();

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrow = await Borrow.findOne({
    "book.id": bookId,
    "user.id": user._id,
    returnDate: null,
  });

  if (!borrow) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }

  borrow.returnDate = new Date();

  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;

  await borrow.save();

  res.status(200).json({
    success: true,
    message:
      fine !== 0
        ? `Returned successfully. Total charges including fine: Nrs ${
            fine + book.price
          }`
        : `Returned successfully. Total charges: Nrs ${book.price}`,
  });
});

// 📌 Fetch current user's borrowed books
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const borrowedBooks = await Borrow.find({ "user.id": userId });

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

// 📌 Fetch all borrowed books (admin)
export const getBorrowedBooksForAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const borrowedBooks = await Borrow.find();
    res.status(200).json({
      success: true,
      borrowedBooks,
    });
  }
);
