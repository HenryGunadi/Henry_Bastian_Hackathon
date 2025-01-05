import mongoose from "mongoose";
import { OrderDoc } from "../../db/models/order";
import { OrderPayload, OrderStoreInterface } from "../types/types";
import BadRequestError from "../classes/BadRequestError";

class OrderStore implements OrderStoreInterface {
  private _orderModel: mongoose.Model<OrderDoc>;

  constructor(orderModel: mongoose.Model<OrderDoc>) {
    this._orderModel = orderModel;
  }

  async createOrder(order: OrderPayload): Promise<boolean | BadRequestError> {
    try {
      const newOrder = new this._orderModel(order);
      await newOrder.save(); // Save to database
      return true;
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return error;
    }
  }

  async getOrders(address: string, role: string): Promise<OrderDoc[] | BadRequestError> {
    try {
      let orders: OrderDoc[] = [];

      if (role === "seller") {
        orders = await this._orderModel.find({ seller_address: address });
      } else if (role === "user") {
        orders = await this._orderModel.find({ buyer_address: address });
      }

      return orders;
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return error;
    }
  }

  async getOrderById(id: string): Promise<OrderDoc | BadRequestError> {
    try {
      const objectId = new mongoose.Types.ObjectId(id);

      const res = await this._orderModel.findById({ _id: objectId });

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

  async acceptOrder(id: string): Promise<boolean | BadRequestError> {
    try {
      const objectId = new mongoose.Types.ObjectId(id);

      const result = await this._orderModel.updateOne({ _id: objectId }, { $set: { status: "accepted" } });

      if (result.modifiedCount === 0) {
        return new BadRequestError({
          code: 404,
          message: "Order not found or status already 'accepted'.",
        });
      }

      return true;
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return error;
    }
  }
}

export default OrderStore;
