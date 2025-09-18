import { sendEmail } from "./sendEmail.js";
import { generateVerificationOtpEmailTemplete } from "./emailTempletes.js";

export const sendVerificationCode = async (email, verificationCode, res) => {
    try {
        const message = generateVerificationOtpEmailTemplete(verificationCode);

        await sendEmail({
            email,
            subject: "Library System - Verification Code",
            message,
        });

        res.status(200).json({
            success: true,
            message: "Verification code sent successfully",
        });

    } catch (error) {
        console.error("Error sending verification code:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send verification code",
        });
    }
};
