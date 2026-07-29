import express from "express";
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getGalleryImages);
router.post("/", protect, adminOnly, addGalleryImage);
router.delete("/:id", protect, adminOnly, deleteGalleryImage);

export default router;
