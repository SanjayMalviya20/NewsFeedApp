import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbConnect = () => {
    mongoose.connect("mongodb+srv://sanjay:sanjaymalviyamongodb@sanjay.fdp92.mongodb.net/test").then(() => console.log("MongoDB connected")) .catch((error) => console.error("MongoDB connection error:", error));

}

export default dbConnect