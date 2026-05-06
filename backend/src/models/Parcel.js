import mongoose from "mongoose";
import { PARCEL_STATUS } from "../utils/constants.js";

const parcelSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },
    receiverName: {
      type: String,
      required: true,
      trim: true,
    },
    transportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
      required: true,
    },
    billNumber: {
      type: String,
      required: true,
      trim: true,
    },
    builtyNumber: {
      type: String,
      required: true,
      trim: true,
    },
    lotNumber: {
      type: String,
      required: true,
      trim: true,
    },
    isParcelOpened: {
      type: Boolean,
      default: false,
    },
    openedDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(PARCEL_STATUS),
      required: true,
      default: PARCEL_STATUS.IN_STOCK,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Parcel = mongoose.model("Parcel", parcelSchema);
