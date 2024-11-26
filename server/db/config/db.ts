import mongoose from "mongoose";
import dotenv from "dotenv";
import { useEffect } from "react";

export const connectDB = async () => {
  dotenv.config();
  const dbURL = process.env.DATABASE_URL;

  console.log("DB URL : ", dbURL);

  // handle if url not found
  if (!dbURL) {
    console.log("DB URL not found!");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbURL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error : ", err);
    process.exit(1);
  }

  const database = mongoose.connection;

  // handle database events
  database.on("error", (err) => console.error("Mongoose connection error:", err));
  database.on("disconnected", () => console.warn("Mongoose disconnected"));
  database.once("connected", () => {
    console.log("Database Connected");
  });
};
