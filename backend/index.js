import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js"

//initialize express
const app = express();

//configure dotenv
dotenv.config();

//port
const PORT = process.env.PORT || 3000;

//cors middleware
app.use(cors({
    origin: 'http://localhost:5173', //frontend origin
    credentials: true, //allow cookies to be sent
}));

//parse incoming requests with JSON
app.use(express.json());

//parse incoming cookies
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("SecureAuth!!!");

});

app.use('/api/auth', authRoutes);


//connecting mongoose database
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
});
})
.catch((error) => {
    console.log("Error connecting to MongoDB: ", error.message);
    process.exit(1);
});

