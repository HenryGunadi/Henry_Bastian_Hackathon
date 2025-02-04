import express, { Express, NextFunction, Request, Response } from "express";
import userRouter from "../src/routes/users";
import authRouter from "../src/routes/auth";
import productRouter from "../src/routes/product";
import orderRouter from "../src/routes/order";
import { errorMiddleware } from "../src/middleware/error";
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
    this.APIServer.use("/auth", authRouter);
    this.APIServer.use("/users", userRouter);
    this.APIServer.use("/product", productRouter);
    this.APIServer.use("/order", orderRouter);

    // error handler middleware
    this.APIServer.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      errorMiddleware(err, req, res, next);
    });

    this.APIServer.listen(this.PORT, () => console.log(`Server started on port ${this.PORT}`));
  }
}
