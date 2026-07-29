import mongoose from "mongoose";

const specSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // e.g. "Grade", "Shelf Life"
    value: { type: String, required: true }, // e.g. "W210", "6 Months"
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "Husk Coconut", "Dry Ball Kopra", "Desiccated Coconut"
    description: { type: String, required: true },
    images: [{ type: String }], // image URLs
    unit: { type: String, default: "kg" }, // kg, piece, quintal, etc.
    priceNote: { type: String, default: "Contact for pricing" }, // e.g. "₹120/kg" or "Bulk pricing on request"
    inStock: { type: Boolean, default: true },
    specs: [specSchema], // e.g. [{ key: "Grade", value: "W210" }, { key: "Shelf Life", value: "6 Months" }]
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
