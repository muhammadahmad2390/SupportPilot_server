import { Router } from "express";
import {
  getTickets,
  getTicekt,
  updateStatus,
} from "../controllers/ticket.controller.ts";

const router = Router();

router.get("/", getTickets);
router.get("/:id", getTicekt);
router.patch("/:id", updateStatus);

export default router;
