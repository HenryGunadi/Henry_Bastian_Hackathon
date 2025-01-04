import { NextFunction, Request, Response } from "express";
import BadRequestError from "../classes/BadRequestError";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Error in middleware:", err);

  // return custom error
  if (err instanceof BadRequestError) {
    return res
      .status(err.statusCode | 400)
      .setHeader("Content-Type", "application/json")
      .json(err.errors);
  }

  // handle the unexpected error
  return res.status(400).setHeader("Content-Type", "application/json").json({
    message: "Something went wrong",
  });
};
