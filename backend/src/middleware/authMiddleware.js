import { User } from "../models/User.js";
import { createError } from "../utils/apiResponse.js";
import { verifyAuthToken } from "../utils/jwt.js";

export const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return next(createError("Authentication required", 401));
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return next(createError("Authentication required", 401));
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).select("_id username role");

    if (!user) {
      return next(createError("Invalid authentication token", 401));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(createError("Invalid or expired authentication token", 401));
  }
};
