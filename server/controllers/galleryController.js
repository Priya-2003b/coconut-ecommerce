import GalleryImage from "../models/GalleryImage.js";

// GET /api/gallery  (public)
export const getGalleryImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/gallery  (admin only)
export const addGalleryImage = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    if (!imageUrl || !imageUrl.trim()) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const image = await GalleryImage.create({
      imageUrl: imageUrl.trim(),
      caption: caption ? caption.trim() : "",
    });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/gallery/:id  (admin only)
export const deleteGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
