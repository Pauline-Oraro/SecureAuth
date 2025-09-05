import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


//route for authorization
router.get('/check-auth', verifyToken, checkAuth);

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