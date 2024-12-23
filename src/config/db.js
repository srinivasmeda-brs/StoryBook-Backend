import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const connectdb = async () => {
  try {
    const connect = await mongoose.connect(process.env.Mongo_URI);
    console.log(`connected to ${connect.connection.host}`);
  } catch (error) {
    console.error("Connection error", error);
    process.exit(1);
  }
};

export default connectdb;