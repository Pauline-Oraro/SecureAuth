import express from "express";
import { forgotPassword, login, logout, resetPassword, signup, verifyEmail } from "../controllers/auth.controller.js";

const router = express.Router();


//signup route
router.post('/signup' ,signup)

//verify email route
router.post('/verify-email' ,verifyEmail)

//login route
router.post('/login' ,login)

//logout route
router.post('/logout' ,logout)

//forgot password route
router.post('/forgot-password' ,forgotPassword);

//reset password route
router.post('/reset-password/:token' ,resetPassword);

export default router;