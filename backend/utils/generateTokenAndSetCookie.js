//jwt is a secure way of transmitting info between a client and a server as a json object. it is used for authentication and authorization.

//Authentication – After a user logs in, the server creates a JWT and sends it to the client. The client stores it (e.g., in localStorage or cookies) and includes it in future requests to verify identity.

//Authorization – JWTs can carry user roles and permissions, allowing access to certain routes or resources.


import jwt from "jsonwebtoken";


// this function is used to generate a token and set it as a cookie in the response
export const generateTokenAndSetCookie = (res, userId) => {
    //generate a token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    //set the token as a cookie in the response
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return token;
}