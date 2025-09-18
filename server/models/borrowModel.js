import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {                 
      type: String,
      required: true,
    },
  },
  book: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    title: String,
    author: String,
  },
  price: {
    type: Number,
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: Date,
  returnDate: {
    type: Date,
    default: null,
  },
  fine: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const Borrow = mongoose.model("Borrow", borrowSchema);
