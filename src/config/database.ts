import mongoose from "mongoose";
import { config } from "./config.js";
import { logger } from "./logger.js";

export async function connectDatabase() {
  try {
    await mongoose.connect(config.mongo_uri);
    logger.info("Database Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    process.exit(1);
  }
}
