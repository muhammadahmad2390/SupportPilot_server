import { Router } from "express";
import {
  createPolicy,
  updatePolicy,
  deletePolicy,
  getPolicies,
  getPolicy,
} from "../controllers/policy.controller.ts";

const router = Router();

router.get("/", getPolicies);
router.get("/:id", getPolicy);
router.post("/", createPolicy);
router.put("/:id", updatePolicy);
router.delete("/:id", deletePolicy);

export default router;
