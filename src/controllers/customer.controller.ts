import type { Request, Response } from "express";
import { Customer } from "../models/customer.model.ts";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find();

    res.status(200).json(customers);
  } catch (err) {
    res.status(500).send("Failed to fetch customers");
  }
};
