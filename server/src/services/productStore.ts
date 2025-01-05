import mongoose from "mongoose";
import { ProductDoc } from "../../db/models/product";
import { ProductStoreInterface } from "../types/types";
import BadRequestError from "../classes/BadRequestError";

export class ProductStore implements ProductStoreInterface {
  // attributes
  private _productModel: mongoose.Model<ProductDoc>;

  constructor(productModel: mongoose.Model<ProductDoc>) {
    this._productModel = productModel;
  }

  async deleteProduct(id: string): Promise<boolean | BadRequestError> {
    try {
      const deletedProduct = await this._productModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        const error = new BadRequestError({
          code: 500,
          message: "Internal server error",
          context: { err: "Something went wrong while deleting products" },
        });
        return error;
      }

      return true;
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return error;
    }
  }

  async getProducts(): Promise<ProductDoc[] | BadRequestError> {
    try {
      const products: ProductDoc[] = await this._productModel.find();
      return products;
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return error;
    }
  }

  async getProductById(id: string): Promise<ProductDoc | BadRequestError> {
    try {
      const objectId = new mongoose.Types.ObjectId(id);

      const res = await this._productModel.findById({ _id: objectId });

      if (res) {
        return res;
      } else {
        const error = new BadRequestError({ code: 400, message: "No record found" });
        return error;
      }
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return error;
    }
  }

  async getSellerProducts(seller_id: string): Promise<ProductDoc[] | BadRequestError> {
    try {
      // Find products where seller_id matches the provided seller_id
      const products: ProductDoc[] = await this._productModel.find({ seller_id: seller_id });
      return products;
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return error;
    }
  }
}
