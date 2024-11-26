import { connectDB } from "../db/config/db";
import { APIServer } from "../api/server";
import dotenv from "dotenv";

dotenv.config();

// initiate APIServer
const port = parseInt(process.env.PORT || "8000");
const server = new APIServer(port);

// start server and database
const startServer = async () => {
  await connectDB();
  server.run();
};

startServer();
