import express from "express";
import { registerUser } from "../controllers/auth.js";
import uploadFile from "../middleware/multer.js";
import { loginUser } from "../controllers/auth.js";
import { forgotPassword } from "../controllers/auth.js";
import { resetPassword } from "../controllers/auth.js";
const router = express.Router();
// Register User
router.post("/register", uploadFile, registerUser);
// Login User
router.post("/login", loginUser);
// forgot password
router.post("/forgot", forgotPassword);
// reset password
router.post("/reset/:token", resetPassword);
export default router;
