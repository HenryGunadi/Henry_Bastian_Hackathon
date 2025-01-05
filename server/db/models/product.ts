import mongoose, { Schema, Document } from "mongoose";

// typescript schemas
export interface ProductDoc extends Document {
  id: string;
  name: string;
  price: number;
  image: string;
  seller_id: string;
}

// mongoDB schemas
const productSchema = new Schema<ProductDoc>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  seller_id: { type: String, required: true },
});

const Product = mongoose.model<ProductDoc>("Product", productSchema, "products");

export default Product;
