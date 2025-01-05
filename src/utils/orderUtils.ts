import { Order, OrderPayload } from "@/types/types";
import axios from "axios";
import { AwardIcon } from "lucide-react";
import React, { SetStateAction } from "react";

export async function CreateOrderRequest(order: OrderPayload) {
  try {
    const res = await axios.post("http://localhost:8000/order/create", order, {
      withCredentials: true,
    });

    console.log(res.data);
  } catch (err) {
    console.error("Order creating order req : ", err);
  }
}

export async function getOrders(setState: React.Dispatch<SetStateAction<Order[]>>) {
  try {
    const res = await axios.get("http://localhost:8000/order/search", {
      withCredentials: true,
    });

    console.log("Get Order : ", res.data);
    setState(res.data.orders);
  } catch (err) {
    console.error(err);
  }
}

export async function getOrderById(setState: React.Dispatch<SetStateAction<Order | undefined>>, id: string) {
  try {
    const res = await axios.get(`http://localhost:8000/order/get?id=${id}`, {
      withCredentials: true,
    });

    setState(res.data.order);
  } catch (err) {
    console.error(err);
  }
}

export async function acceptOrder(order_id: string) {
  try {
    const res = await axios.patch(
      `http://localhost:8000/order/update?id=${order_id}`,
      {},
      {
        withCredentials: true,
      }
    );

    console.log("Acccept order : ", res.data);
    return res.data.success;
  } catch (err) {
    console.error(err);
  }
}
