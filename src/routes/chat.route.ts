import express from "express";
import { Router } from "express";
import chat from "../controllers/chat.controller.ts";

const router: Router = express.Router();

router.post("/chat", chat);

export default router;
