import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
  service: "gmail",  
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

  const mailOptions = {
    from: `"Library System" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} | Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error.message);
    throw new Error(error.message); 
  }
};
