import type { Router } from "express";
import express from "express";
import {
  getConversations,
  getConversation,
} from "../controllers/conversation.controller.ts";

const router: Router = express.Router();

router.get("/", getConversations);
router.get("/:id", getConversation);

export default router;
