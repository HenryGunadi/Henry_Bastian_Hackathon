import { NextFunction, Request, Response } from "express";

export default function setCorsHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // for development only
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
}
