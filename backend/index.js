import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";

import authRoutes from "./routes/auth.route.js"

//initialize express
const app = express();

//configure dotenv
dotenv.config();

//port
const PORT = process.env.PORT || 3000;

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

