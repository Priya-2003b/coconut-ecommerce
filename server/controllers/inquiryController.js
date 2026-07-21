import Inquiry from "../models/Inquiry.js";

// POST /api/inquiries  (logged-in customer submits an inquiry)
export const createInquiry = async (req, res) => {
  try {
    const { product, message, quantity } = req.body;
    const inquiry = await Inquiry.create({
      user: req.user.id,
      product,
      message,
      quantity,
    });
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/inquiries/mine  (customer views their own inquiries)
export const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user.id })
      .populate("product", "name category")
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/inquiries  (admin views all inquiries)
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("user", "name email phone")
      .populate("product", "name category")
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/inquiries/:id  (admin updates status: pending/contacted/closed)
export const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
