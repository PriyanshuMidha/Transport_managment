import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { createError } from "../utils/apiResponse.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(createError("Authentication required", 401));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { username: payload.username, role: payload.role };
    return next();
  } catch (error) {
    return next(createError("Invalid or expired token", 401));
  }
};

export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user?.role)) {
    return next(createError("You do not have permission to perform this action", 403));
  }
  return next();
};
