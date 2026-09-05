import { Router } from "express";
import { body } from "express-validator";
import { login } from "../controllers/authController.js";

const router = Router();

router.post(
  "/login",
  [body("username").trim().notEmpty(), body("password").notEmpty()],
  login
);

export default router;
