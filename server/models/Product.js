import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "Husk Coconut", "Dry Ball Kopra", "Desiccated Coconut"
    description: { type: String, required: true },
    images: [{ type: String }], // image URLs
    unit: { type: String, default: "kg" }, // kg, piece, quintal, etc.
    priceNote: { type: String, default: "Contact for pricing" }, // e.g. "₹120/kg" or "Bulk pricing on request"
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
