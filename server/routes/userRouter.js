import express from "express";
import {
    getAllUser,
    registerNewAdmin,
} from "../controllers/userController.js";

import {
    isAuthenticated,
    isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("admin"), getAllUser);
router.post("/add/new-admin", isAuthenticated, isAuthorized("admin"), registerNewAdmin);

export default router;


