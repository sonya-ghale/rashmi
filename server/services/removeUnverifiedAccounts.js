import { User } from "../models/userModel.js";

export const removeUnverifiedAccounts = async () => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const result = await User.deleteMany({
      accountVerified: false,
      createdAt: { $lt: thirtyMinutesAgo },
    });

    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} unverified accounts.`);
    }
  } catch (error) {
    console.error("Error in removeUnverifiedAccounts job:", error);
  }
};
