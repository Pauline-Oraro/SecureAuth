import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

//implementing the signup function
export const signup = async (req, res) => { 

    //getting the email, password, name from the request body
    const { email, password, name } = req.body;

    try{
        //if email, password and name are not provided
        if(!email || !password || !name){
            throw new Error("Email, password and name are required");
        }

        //check if user already exists or not
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success: false, message: "User already exists"});
        }

        //Instead of saving plain text passwords in a database, bcrypt converts them into hashed strings that are extremely difficult to crack.
        const hashedPassword = await bcryptjs.hash(password, 10);

        //creating a verification code
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        //create new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await newUser.save()

        generateTokenAndSetCookie(res, newUser._id);
    

        await sendVerificationEmail(newUser.email, verificationToken)

        res.status(201).json({
            success: true,
            message: "User created successfully",
            newUser:{
                ...newUser._doc,
                password: undefined
            }
        })
    }
    catch(error){
        res.status(400).json({ success: false, message: error.message });
    }
}

//implementing the verify email function
export const verifyEmail = async (req, res) => {
	const { code } = req.body; 
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});

	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};


//implementing the login function
export const login = async (req, res) => {
    //get the email and password from the request body
    const { email, password } = req.body;

    try{
        //find the user with the given email
        const user = await User.findOne({ email });

        //not found the user
        if(!user){
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        //compare the password with the hashed password
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        //if password is not valid
        if(!isPasswordValid){
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();

        //save user to the database
        await user.save();

        res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});

    }
    catch(error){
        res.status(400).json({ success: false, message: error.message });
    }
}


//implementing the logout function
export const logout = (req, res) => {
    res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
}


//forgot password function
export const forgotPassword = async (req, res) => {
    //getting the email from the request body
    const {email} = req.body;

    try{
        //check if user exists
        const user = await User.findOne({email});

        //if user does not exist
        if(!user){
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        //if user exists generate a reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        //token expiry date 
        const resetTokenExpiryDate = Date.now() + 1 * 60 * 60 * 1000

        //save it to the database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiryDate;
        await user.save();

        //send password reset email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    }

    catch(error){
        res.status(400).json({ success: false, message: error.message });
    }
}