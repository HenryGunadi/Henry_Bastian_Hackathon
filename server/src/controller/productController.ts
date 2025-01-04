import { NextFunction, Request, Response } from "express";
import { ProductStore } from "../services/productStore";
import BadRequestError from "../classes/BadRequestError";
import { ProductPayload } from "../types/types";
import Product from "../../db/models/product";

export class ProductController {
  private _store: ProductStore;

  constructor(store: ProductStore) {
    this._store = store;
  }

  addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as ProductPayload;
      const imageURL = req.file ? req.file.path : "";
      const formattedImageURL = imageURL.split("\\").pop() || "";

      console.log("Product : ", payload);
      console.log("IMAGE FROM PRODUCT CONTROLLER : ", formattedImageURL);

      // add product
      const product = new Product({
        name: payload.name,
        price: payload.price,
        image: formattedImageURL,
        seller_id: payload.seller_id,
      });

      await product.save();

      res.status(200).json({ message: "Product added" });
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: `Error in add product : ${err}` } });
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.query as { id: string };

      const queryRes = await this._store.deleteProduct(payload.id);

      if (queryRes instanceof BadRequestError) {
        return next(queryRes);
      }

      res.status(200).json({ message: "Product deleted" });
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      next(error);
    }
  };

  getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (err) {}
  };
}
