import express from "express";
import {
  createInquiry,
  getMyInquiries,
  getAllInquiries,
  updateInquiryStatus,
} from "../controllers/inquiryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer routes (must be logged in)
router.post("/", protect, createInquiry);
router.get("/mine", protect, getMyInquiries);

// Admin routes
router.get("/", protect, adminOnly, getAllInquiries);
router.put("/:id", protect, adminOnly, updateInquiryStatus);

export default router;
