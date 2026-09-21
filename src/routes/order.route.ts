import { Router } from "express";
import { getOrders } from "../controllers/order.controller.ts";

const router = Router();

router.get("/", getOrders);

export default router;
