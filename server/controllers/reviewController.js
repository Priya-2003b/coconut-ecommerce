import Review from "../models/Review.js";

export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { name, company, rating, review } = req.body;
    if (!name || !rating || !review) {
      return res.status(400).json({ message: "Name, rating, and review are required" });
    }
    const newReview = await Review.create({ name, company, rating, review, status: "pending" });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review" });
  }
};

export const setReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Review not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update review" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};