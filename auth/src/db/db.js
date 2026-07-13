import mongoose from "mongoose";
import config from "../config/config.js";

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected successfully.......");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

export default connectDB; 
