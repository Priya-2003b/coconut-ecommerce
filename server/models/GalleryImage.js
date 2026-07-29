import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("GalleryImage", galleryImageSchema);
