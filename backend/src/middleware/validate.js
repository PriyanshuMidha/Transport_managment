import { validationResult } from "express-validator";
import { createError } from "../utils/apiResponse.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return next(createError(firstError.msg, 400, errors.array()));
  }
  return next();
};
