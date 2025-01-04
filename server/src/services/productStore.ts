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
        const error = new BadRequestError({ code: 500, message: "Internal server error", context: { err: "Something went wrong while deleting products" } });
        return error;
      }

      return true;
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return error;
    }
  }
}
