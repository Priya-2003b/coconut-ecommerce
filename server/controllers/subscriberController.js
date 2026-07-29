import Subscriber from "../models/Subscriber.js";

// POST /api/subscribers  (public)
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Subscriber.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(200).json({ message: "You're already subscribed!" });
    }

    await Subscriber.create({ email: email.trim().toLowerCase() });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
