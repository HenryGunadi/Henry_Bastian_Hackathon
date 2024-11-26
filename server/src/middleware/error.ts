import { NextFunction, Request, Response } from "express";
import BadRequestError from "../classes/BadRequestError";

export const errorHandler = (err: BadRequestError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(err.statusCode).send({ errors: [{ message: err.message }] });
};
