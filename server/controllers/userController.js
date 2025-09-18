import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errormiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ accountVerified: true });

    res.status(200).json({
        success: true,
        users,
    });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Admin avatar is required.", 400));
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }

    const isRegistered = await User.findOne({ email, accountVerified: true }); // ✅ FIXED here
    if (isRegistered) {
        return next(new ErrorHandler("User already registered.", 400));
    }

    if (password.length < 6 || password.length > 20) {
        return next(
            new ErrorHandler("Password must be between 6 to 20 characters long.", 400)
        );
    }

   const avatar = req.files?.avatar;
     if (!avatar) {
     return next(new ErrorHandler("Admin avatar is required.", 400));
     }

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(new ErrorHandler("File format not supported.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
            folder: "LIBRARY_MANAGEMENT-SYSTEM_ADMIN_AVATAR",
        }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary error:",
            cloudinaryResponse.error || "Unknown cloudinary error."
        );
        return next(new ErrorHandler("Failed to upload image to cloudinary.", 500));
    }

    const admin = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
        accountVerified: true,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(201).json({
        success: true,
        message: "Admin registered successfully.",
        admin,
    });
});
