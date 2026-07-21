import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    message: { type: String, required: true },
    quantity: { type: String }, // e.g. "50 kg", "2 quintal"
    status: {
      type: String,
      enum: ["pending", "contacted", "closed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
