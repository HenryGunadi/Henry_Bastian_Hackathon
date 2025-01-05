import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { User } from "../types/types";

dotenv.config();

export default async function validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.auth_cookie;
  const secret = process.env.ACCESS_TOKEN_SECRET || "";

  console.log("Token from cookie : ", req.cookies?.auth_cookie);

  if (!token) {
    res.status(401).json({ error: "Unauthorized missing token" });
    return;
  }

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: "User is not authorized" });
    }

    console.log("DECODED USER : ", decoded);
    req.user = decoded as User;

    console.log("User is authenticated");
    next();
  });
}
