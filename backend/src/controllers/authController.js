import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { env } from "../config/env.js";
import { createError, sendSuccess } from "../utils/apiResponse.js";

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError("Username and password are required", 400, errors.array());
  }

  const { username, password } = req.body;

  const user = env.users.find((candidate) => candidate.username === username);
  const isPasswordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !isPasswordValid) {
    throw createError("Invalid username or password", 401);
  }

  const token = jwt.sign({ username: user.username, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  return sendSuccess(res, { token, username: user.username, role: user.role }, "Login successful");
});
