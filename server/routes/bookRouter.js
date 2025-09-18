import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import {addBook, 
    deleteBook, 
    getAllBooks
} from "../controllers/bookController.js";
import express from "express";

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("admin"), addBook);
router.get("/all", isAuthenticated, getAllBooks);
router.delete("/admin/delete/:id", isAuthenticated, isAuthorized("admin"), deleteBook);

export default router;