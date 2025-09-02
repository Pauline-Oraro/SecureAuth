import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

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




//implementing the login function
export const login = (req, res) => {
    res.send('Login Page');
}

//implementing the logout function
export const logout = (req, res) => {
    res.send('Logout Page');
}
