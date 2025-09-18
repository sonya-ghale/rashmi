export function generateVerificationOtpEmailTemplete(otpcode) {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #000; color: #fff;">
        <h2 style="color: #fff; text-align: center;">Verify Your Email Address</h2>
        <p style="font-size: 16px; color: #ccc;">Dear User,</p>
        <p style="font-size: 16px; color: #ccc;">Thank you for registration or login. Please use the following verification code:</p>
        <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #000; padding: 10px 20px; border: 1px solid #fff; border-radius: 5px; background-color: #fff;">
                ${otpcode}
            </span>
        </div>
        <p style="font-size: 16px; color: #ccc;">This code is valid for 15 minutes. Please do not share this code with anyone.</p>
        <p style="font-size: 16px; color: #ccc;">If you did not request this, please ignore this email.</p>
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
            <p>Thank you,<br>Library Management System Team</p>
            <p style="font-size: 12px; color: #444;">This is an automated message, please do not reply.</p>
        </footer>
    </div>`;
}

export const generateForgotPasswordEmailTemplate = (resetUrl) => {
    return `
        <h2>Password Reset Requested</h2>
        <p>You requested to reset your password for your Library Management System account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <br/>
        <p>If you did not request this password reset, please ignore this email.</p>
    `;
};
