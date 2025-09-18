import { config } from 'dotenv';
config({ path: './config/config.env' });

import { app } from './app.js';
import { connectDB } from './database/db.js';
import { v2 as cloudinary } from 'cloudinary';
import { notifyUsers } from './services/notifyUser.js';
import { removeUnverifiedAccounts } from './services/removeUnverifiedAccounts.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

connectDB();

notifyUsers();              
removeUnverifiedAccounts(); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
