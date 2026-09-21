import { Router } from "express";
import { getCustomers } from "../controllers/customer.controller.ts";

const router = Router();

router.get("/", getCustomers);

export default router;
