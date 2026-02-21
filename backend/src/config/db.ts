import mongoose from "mongoose";
import env from "./env";
import logger from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  // Handle connection events after initial connect
  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB runtime error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
};

export default connectDB;
