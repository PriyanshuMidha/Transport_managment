import bcrypt from "bcryptjs";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { env } from "../config/env.js";
import { Parcel } from "../models/Parcel.js";
import { Transport } from "../models/Transport.js";
import { createError, sendSuccess } from "../utils/apiResponse.js";
import { PARCEL_STATUS } from "../utils/constants.js";

const parcelPopulate = {
  path: "transportId",
  select: "name",
};

const validateBasePayload = async ({
  date,
  supplierName,
  receiverName,
  transportId,
  billNumber,
  builtyNumber,
  lotNumber,
}) => {
  const transport = await Transport.findById(transportId);

  if (!transport) {
    throw createError("Selected transport does not exist", 400);
  }

  return {
    date,
    supplierName: supplierName.trim(),
    receiverName: receiverName.trim(),
    transportId,
    billNumber: billNumber.trim(),
    builtyNumber: builtyNumber.trim(),
    lotNumber: lotNumber.trim(),
  };
};

const formatCreatePayload = async (body, username) => {
  const payload = await validateBasePayload(body);

  return {
    ...payload,
    isParcelOpened: false,
    openedDate: null,
    status: PARCEL_STATUS.IN_STOCK,
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    createdBy: username,
  };
};

const formatEditPayload = (body) => validateBasePayload(body);

const buildReportQuery = (status, search = "") => {
  const query = {
    status,
    isDeleted: false,
  };

  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    query.supplierName = {
      $regex: trimmedSearch,
      $options: "i",
    };
  }

  return query;
};

export const createParcel = asyncHandler(async (req, res) => {
  const payload = await formatCreatePayload(req.body, req.user.username);
  const parcel = await Parcel.create(payload);
  const populatedParcel = await Parcel.findById(parcel._id).populate(parcelPopulate);

  return sendSuccess(res, populatedParcel, "Parcel created successfully", 201);
});

export const getParcels = asyncHandler(async (req, res) => {
  const parcels = await Parcel.find({ isDeleted: false })
    .populate(parcelPopulate)
    .sort({ supplierName: 1, date: -1 })
    .lean();
  return sendSuccess(res, parcels, "Parcels fetched successfully");
});

export const getOpenedParcelsReport = asyncHandler(async (req, res) => {
  const parcels = await Parcel.find(buildReportQuery(PARCEL_STATUS.OPENED, req.query.search || ""))
    .populate(parcelPopulate)
    .sort({ supplierName: 1, date: -1 })
    .lean();

  return sendSuccess(res, parcels, "Opened report fetched successfully");
});

export const getInStockParcelsReport = asyncHandler(async (req, res) => {
  const parcels = await Parcel.find(buildReportQuery(PARCEL_STATUS.IN_STOCK, req.query.search || ""))
    .populate(parcelPopulate)
    .sort({ supplierName: 1, date: -1 })
    .lean();

  return sendSuccess(res, parcels, "In-stock report fetched successfully");
});

export const editParcel = asyncHandler(async (req, res) => {
  const parcel = await Parcel.findById(req.params.id);

  if (!parcel) {
    throw createError("Parcel not found", 404);
  }

  if (parcel.isDeleted) {
    throw createError("Deleted parcels cannot be edited", 400);
  }

  if (parcel.status !== PARCEL_STATUS.IN_STOCK) {
    throw createError("Only in-stock parcels can be edited", 400);
  }

  const payload = await formatEditPayload(req.body);

  Object.assign(parcel, payload, {
    updatedBy: req.user.username,
  });

  await parcel.save();

  const populatedParcel = await Parcel.findById(parcel._id).populate(parcelPopulate);
  return sendSuccess(res, populatedParcel, "Parcel updated successfully");
});

export const markParcelOpened = asyncHandler(async (req, res) => {
  const parcel = await Parcel.findById(req.params.id);

  if (!parcel) {
    throw createError("Parcel not found", 404);
  }

  if (parcel.isDeleted) {
    throw createError("Deleted parcels cannot be opened", 400);
  }

  if (parcel.status !== PARCEL_STATUS.IN_STOCK) {
    throw createError("Only in-stock parcels can be marked as opened", 400);
  }

  parcel.isParcelOpened = true;
  parcel.status = PARCEL_STATUS.OPENED;
  parcel.openedDate = new Date();
  parcel.updatedBy = req.user.username;

  await parcel.save();

  const populatedParcel = await Parcel.findById(parcel._id).populate(parcelPopulate);
  return sendSuccess(res, populatedParcel, "Parcel marked as opened successfully");
});

export const deleteParcel = asyncHandler(async (req, res) => {
  const isPasswordValid = await bcrypt.compare(req.body.confirmPassword || "", env.deletePasswordHash);

  if (!isPasswordValid) {
    throw createError("Incorrect password", 401);
  }

  const parcel = await Parcel.findById(req.params.id);

  if (!parcel) {
    throw createError("Parcel not found", 404);
  }

  if (parcel.isDeleted) {
    throw createError("Parcel has already been deleted", 400);
  }

  if (parcel.status !== PARCEL_STATUS.OPENED) {
    throw createError("Only opened parcels can be deleted", 400);
  }

  parcel.isDeleted = true;
  parcel.deletedAt = new Date();
  parcel.deletedBy = req.user.username;
  parcel.updatedBy = req.user.username;

  await parcel.save();

  return sendSuccess(res, null, "Parcel deleted successfully");
});

export const cleanupDeletedParcels = asyncHandler(async (req, res) => {
  if (!env.enableDeletedParcelCleanup) {
    throw createError("Deleted parcel cleanup is not enabled", 403);
  }

  const thresholdDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await Parcel.deleteMany({
    isDeleted: true,
    deletedAt: {
      $lte: thresholdDate,
    },
  });

  return sendSuccess(
    res,
    {
      deletedCount: result.deletedCount,
      thresholdDate,
    },
    "Deleted parcel cleanup completed successfully"
  );
});
