import { Router } from "express";
import { createTransport, getTransports } from "../controllers/transportController.js";

const router = Router();

router.get("/", getTransports);
router.post("/", createTransport);

export default router;
