import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a book title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please provide the author name"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Please provide the price of the book"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide the quantity of the book"],
      min: [0, "Quantity cannot be negative"],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    publishedYear: {
      type: Number,
    },
    coverImage: {
      type: String, // store URL or file path
      default: "",
    },
  },
  { timestamps: true }
);

bookSchema.pre("save", function (next) {
  this.availability = this.quantity > 0;
  next();
});

export const Book = mongoose.model("Book", bookSchema);
