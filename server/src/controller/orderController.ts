import e, { NextFunction, Request, Response } from "express";
import OrderStore from "../services/orderStore";
import BadRequestError from "../classes/BadRequestError";
import { OrderPayload, User } from "../types/types";

class OrderController {
  private _store: OrderStore;

  constructor(store: OrderStore) {
    this._store = store;
  }

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as OrderPayload;
      const queryRes = await this._store.createOrder(payload);

      if (queryRes instanceof BadRequestError) {
        return next(queryRes);
      }

      if (queryRes) {
        return res.status(200).json({ message: "success" });
      }
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return next(error);
    }
  };

  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;
      console.log("USER ADDR : ", user.stake_addr);
      console.log("USER ROLES : ", user.roles);

      const orders = await this._store.getOrders(user.stake_addr, user.roles);

      return res.status(200).json({ message: "Success", orders: orders });
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return next(error);
    }
  };

  getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.query as { id: string };

      const order = await this._store.getOrderById(payload.id);
      if (order instanceof BadRequestError) {
        return next(order);
      }

      return res.status(200).json({ message: "success", order: order });
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return next(error);
    }
  };

  acceptOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryId = req.query as { id: string };

      const result = await this._store.acceptOrder(queryId.id);

      if (result instanceof BadRequestError) {
        return next(result);
      }

      if (!result) {
        const error = new BadRequestError({ code: 500, message: "Something went wrong", context: { error: "No rows are updated" } });
        return next(error);
      }

      return res.status(200).json({ message: "success", success: result });
    } catch (err) {
      const error = new BadRequestError({ code: 500, message: "Internal server error", context: { error: err } });
      return next(error);
    }
  };
}

export default OrderController;
