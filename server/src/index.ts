import { connectDB } from "../db/config/db";
import { APIServer } from "../api/server";
import dotenv from "dotenv";
import startCronJob from "../db/jobs/cronJobs";

dotenv.config();

// initiate APIServer
const port = parseInt("8000");
const server = new APIServer(port);

// start server and database
const startServer = async () => {
  await connectDB();
  server.run();
  startCronJob();
};

startServer();
