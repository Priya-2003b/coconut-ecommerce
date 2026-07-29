import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      const res = await api.post("/subscribers", { email });
      showToast(res.data.message || "Subscribed!");
      setEmail("");
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div>
          <h3>Stay in the loop</h3>
          <p>Get updates on new products and offers — no spam, ever.</p>
        </div>
        <form onSubmit={handleSubscribe} className="footer-newsletter-form">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={subscribing}>
            {subscribing ? "..." : "Subscribe"}
          </button>
        </form>
      </div>

      <div className="footer-grid">
        {/* Contact Details */}
        <div className="footer-col">
          <h3>Contact Details</h3>
          <p className="footer-line">✉️ info@agriwhale.com</p>
          <p className="footer-line">
            📍 No.41, GR Kalyana Mantap
            <br />
            Hebbal Address ORR
            <br />
            Bangalore - 560094
          </p>
          <p className="footer-line">📞 +91 9148249999</p>

          <div className="footer-socials">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Pinterest">p</a>
            <a href="#" aria-label="Twitter">t</a>
            <a href="#" aria-label="Instagram">i</a>
          </div>
        </div>

        {/* Food Products */}
        <div className="footer-col">
          <h3>Food Products</h3>
          <Link to="/products?category=Cashew Nuts">Cashew Nuts</Link>
          <Link to="/products?category=Cardamom">Cardamom - Premium 8mm +</Link>
          <Link to="/products?category=Desiccated Coconut">Desiccated Coconut</Link>
          <Link to="/products?category=Coffee Powder">Coffee Powder</Link>
          <Link to="/products?category=Husk Coconuts">Husk Coconuts</Link>
          <Link to="/products?category=Moong Dal">Moong Dal</Link>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h3>Links</h3>
          <Link to="/">Home</Link>
          <Link to="/#about">About Us</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/#contact">Contact Us</Link>
        </div>

        {/* Location */}
        <div className="footer-col">
          <h3>Location</h3>
          <a
            href="https://www.google.com/maps/search/?api=1&query=No.41+GR+Kalyana+Mantap+Hebbal+ORR+Bangalore+560094"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-map-placeholder"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Agri Whale. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
