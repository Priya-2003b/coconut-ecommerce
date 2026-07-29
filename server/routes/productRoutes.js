import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renameCategory,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes - anyone can browse the catalog
router.get("/", getProducts);

// Admin-only: rename a category across all products (must come before /:id)
router.put("/category/rename", protect, adminOnly, renameCategory);

router.get("/:id", getProductById);

// Admin-only routes
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
