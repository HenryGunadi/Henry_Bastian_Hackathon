import expresss, { NextFunction, Request, Response } from "express";
import OrderStore from "../services/orderStore";
import Order from "../../db/models/order";
import OrderController from "../controller/orderController";
import validateToken from "../middleware/validateToken";

const router = expresss.Router();
const orderStore = new OrderStore(Order);
const orderController = new OrderController(orderStore);

router.post("/create", validateToken, (req: Request, res: Response, next: NextFunction) => {
  orderController.createOrder(req, res, next);
});

router.get("/search", validateToken, (req: Request, res: Response, next: NextFunction) => {
  orderController.getOrders(req, res, next);
});

router.get("/get", validateToken, (req: Request, res: Response, next: NextFunction) => {
  orderController.getOrderById(req, res, next);
});

router.patch("/update", validateToken, (req: Request, res: Response, next: NextFunction) => {
  orderController.acceptOrder(req, res, next);
});

export default router;
