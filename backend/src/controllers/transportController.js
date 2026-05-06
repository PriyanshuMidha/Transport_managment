import { asyncHandler } from "../middleware/asyncHandler.js";
import { Transport } from "../models/Transport.js";
import { createError, sendSuccess } from "../utils/apiResponse.js";

export const getTransports = asyncHandler(async (req, res) => {
  const transports = await Transport.find().sort({ name: 1 });
  return sendSuccess(res, transports, "Transports fetched successfully");
});

export const createTransport = asyncHandler(async (req, res) => {
  const name = req.body?.name?.trim();

  if (!name) {
    throw createError("Transport name is required", 400);
  }

  const normalizedName = name.toLowerCase();
  const existingTransport = await Transport.findOne({ normalizedName });

  if (existingTransport) {
    throw createError("Transport name already exists", 409);
  }

  const transport = await Transport.create({ name, normalizedName });
  return sendSuccess(res, transport, "Transport created successfully", 201);
});
