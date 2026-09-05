import { Router } from "express";
import { body } from "express-validator";
import { createTransport, getTransports } from "../controllers/transportController.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", getTransports);
router.post("/", [body("name").trim().notEmpty().withMessage("Transport name is required")], validate, createTransport);

export default router;
