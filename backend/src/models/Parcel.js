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
      type: String,
      default: null,
    },
    createdBy: {
      type: String,
      default: null,
    },
    updatedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

parcelSchema.index({ isDeleted: 1, status: 1, supplierName: 1, date: -1 });
parcelSchema.index({ transportId: 1 });

export const Parcel = mongoose.model("Parcel", parcelSchema);
