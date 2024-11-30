import express, { Express } from "express";
import userRouter from "../src/routes/users";
import authRouter from "../src/routes/auth";
import { errorHandler } from "../src/middleware/error";
import setCorsHeaders from "../src/middleware/cors";
import cookieParser from "cookie-parser";

export class APIServer {
  private APIServer: Express;
  private PORT: number;

  constructor(port: number) {
    this.APIServer = express();
    this.PORT = port;
  }

  run(): void {
    this.APIServer.use(express.json()); // allow to accept data in JSON format
    this.APIServer.use(express.urlencoded({ extended: true })); // URL-encoded data for dealing with forms
    this.APIServer.use(setCorsHeaders);
    this.APIServer.use(cookieParser());

    // services
    this.APIServer.use("/users", userRouter);
    this.APIServer.use("/auth", authRouter);

    // error handler middleware
    this.APIServer.use(errorHandler);

    this.APIServer.listen(this.PORT, () => console.log(`Server started on port ${this.PORT}`));
  }
}
