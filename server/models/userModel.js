import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, 
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  accountVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: Number,
  },
  verificationCodeExpires: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  borrowedBooks: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      returned: {
        type: Boolean,
        default: false,
      },
      booktitle: {
        type: String,
      },
      borrowedBooksDate: {
        type: Date,
        default: Date.now,
      },
      dueDate: {
        type: Date,
      },
    }
  ],
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
}, {
  timestamps: true,
});

userSchema.methods.generateVerificationCode = function () {
  const generate6DigitOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  const verificationCode = generate6DigitOTP();
  this.verificationCode = verificationCode;
  this.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
  return verificationCode;
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
  return resetToken;
};


export const User = mongoose.models.User || mongoose.model("User", userSchema);
