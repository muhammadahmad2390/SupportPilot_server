import type { Request, Response } from "express";
import { Order } from "../models/order.model.ts";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).send("Failed to fetch orders");
  }
};
