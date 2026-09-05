import { body } from "express-validator";

const basePayloadRules = [
  body("date").notEmpty().withMessage("Date is required"),
  body("supplierName").trim().notEmpty().withMessage("Supplier name is required"),
  body("receiverName").trim().notEmpty().withMessage("Receiver name is required"),
  body("transportId").notEmpty().withMessage("Transport name is required").isMongoId().withMessage("Invalid transport"),
  body("billNumber").trim().notEmpty().withMessage("Bill number is required"),
  body("builtyNumber").trim().notEmpty().withMessage("Builty number is required"),
  body("lotNumber").trim().notEmpty().withMessage("Lot number is required"),
];

const restrictedFields = ["status", "openedDate", "isParcelOpened", "isDeleted", "deletedAt", "deletedBy"];

export const createParcelRules = basePayloadRules;

export const editParcelRules = [
  ...basePayloadRules,
  body().custom((value) => {
    const attemptedRestrictedField = restrictedFields.find((field) => field in value);
    if (attemptedRestrictedField) {
      throw new Error(`Field ${attemptedRestrictedField} cannot be edited`);
    }
    return true;
  }),
];
