import mongoose, { Schema, Document } from "mongoose";

// typescript schemas
export interface OrderDoc extends Document {
  _id: string;
  buyer_address: string;
  seller_address: string;
  price: number;
  productId: string;
  status: "ongoing" | "accepted" | "terminated";
  deadline: Date;
  txHash: string;
}

// mongoDB schemas
const orderSchema = new Schema<OrderDoc>({
  buyer_address: { type: String, required: true },
  seller_address: { type: String, required: true },
  price: { type: Number, required: true },
  productId: { type: String, required: true },
  status: { type: String, enum: ["ongoing", "accepted", "terminated"], required: true },
  deadline: { type: Date, required: true },
  txHash: { type: String, required: true },
});

const Order = mongoose.model<OrderDoc>("Order", orderSchema, "orders");

export default Order;
