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

const router = Router();

router.get("/", getParcels);
router.post("/", createParcel);
router.get("/report/opened", getOpenedParcelsReport);
router.get("/report/in-stock", getInStockParcelsReport);
router.delete("/cleanup/deleted", cleanupDeletedParcels);
router.patch("/:id", editParcel);
router.patch("/:id/open", markParcelOpened);
router.delete("/:id", deleteParcel);

export default router;
