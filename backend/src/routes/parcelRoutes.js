import { Router } from "express";
import {
  cleanupDeletedParcels,
  createParcel,
  deleteParcel,
  editParcel,
  getInStockParcelsReport,
  getOpenedParcelsReport,
  getParcels,
  markParcelOpened,
} from "../controllers/parcelController.js";
import { requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createParcelRules, editParcelRules } from "../validators/parcelValidators.js";

const router = Router();

router.get("/", getParcels);
router.post("/", createParcelRules, validate, createParcel);
router.get("/report/opened", getOpenedParcelsReport);
router.get("/report/in-stock", getInStockParcelsReport);
router.delete("/cleanup/deleted", requireRole("admin"), cleanupDeletedParcels);
router.patch("/:id", editParcelRules, validate, editParcel);
router.patch("/:id/open", markParcelOpened);
router.delete("/:id", requireRole("admin"), deleteParcel);

export default router;
