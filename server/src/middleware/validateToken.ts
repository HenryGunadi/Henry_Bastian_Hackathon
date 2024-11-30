import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function (req: Request, res: Response, next: NextFunction) {
  const authCookie = req.headers["auth_cookie"]?.[0];
  const secret = process.env.ACCESS_TOKEN_SECRET || "";

  if (authCookie == undefined) return res.sendStatus(401).json({ message: "token not found" });
  if (secret == "") return res.sendStatus(500).json({ message: "internal server error" });

  // If there is a cookie, verify it
  jwt.verify(authCookie, secret, (err, user) => {
    // If there is an error, return an error
    if (err) return res.sendStatus(403);

    // If there is no error, continue the execution
    next();
  });
}
