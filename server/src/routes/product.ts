import express, { NextFunction, Request, Response } from "express";
import validateToken from "../middleware/validateToken";
import { ProductStore } from "../services/productStore";
import Product from "../../db/models/product";
import { ProductController } from "../controller/productController";
import multerMiddleware from "../middleware/multer";

const router = express.Router();
const productStore = new ProductStore(Product);
const productController = new ProductController(productStore);

router.post("/create", validateToken, multerMiddleware.single("image"), (req: Request, res: Response, next: NextFunction) => {
  productController.addProduct(req, res, next);
});

router.delete("/delete", validateToken, (req: Request, res: Response, next: NextFunction) => {
  productController.deleteProduct(req, res, next);
});

router.get("/search", validateToken, (req: Request, res: Response, next: NextFunction) => {
  productController.getProduct(req, res, next);
});

export default router;
