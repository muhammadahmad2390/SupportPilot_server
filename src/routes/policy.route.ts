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
router.get("/:slug", getPolicy);
router.post("/", createPolicy);
router.put("/:slug", updatePolicy);
router.delete("/:slug", deletePolicy);

export default router;
