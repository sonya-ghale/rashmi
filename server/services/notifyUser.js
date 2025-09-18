import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const borrowers = await Borrow.find({
      dueDate: { $lt: oneDayAgo },
      returnDate: null,
      notified: false,
    }).populate("user.id", "email name");

    for (const element of borrowers) {
      const userData = element.user.id;

      if (userData?.email) {
        await sendEmail({
          email: userData.email,
          subject: "Book return reminder",
          message: `Hello ${userData.name},\n\nThis is a reminder that the book you borrowed is overdue. Please return it.\n\nThank You!`,
        });

        element.notified = true;
        await element.save();

        console.log(`Email sent to ${userData.email}`);
      }
    }
  } catch (error) {
    console.error("Error in notifyUsers job:", error);
  }
};
