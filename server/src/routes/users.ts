import express, { NextFunction, Request, Response } from "express";
import validateToken from "../middleware/validateToken";
import { loginValidator } from "../validators/authValidator";

const router = express.Router();

// validate token middleware
router.get("/dashboard", validateToken, (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Success" });
});

export default router;
