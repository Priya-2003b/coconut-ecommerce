import express from "express";
import {
  getApprovedReviews,
  getAllReviews,
  submitReview,
  setReviewStatus,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js"; // confirm these export names match your galleryRoutes.js

const router = express.Router();

router.get("/", getApprovedReviews);
router.post("/", submitReview);
router.get("/all", protect, adminOnly, getAllReviews);
router.patch("/:id/approve", protect, adminOnly, setReviewStatus);
router.delete("/:id", protect, adminOnly, deleteReview);

export default router;