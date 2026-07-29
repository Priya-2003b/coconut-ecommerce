import express from "express";
import {
  getCategories,
  createCategory,
  renameCategoryById,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public - anyone can see the category list
router.get("/", getCategories);

// Admin-only
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, renameCategoryById);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
