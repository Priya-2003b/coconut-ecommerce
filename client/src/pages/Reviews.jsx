import { useEffect, useState } from "react";
import api from "../api/axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = () => {
    api
      .get("/reviews")
      .then((res) => setReviews(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div>
      <div className="page-banner">
        <span className="hero-badge">Customer Stories</span>
        <h1 className="page-banner-heading">What Our Buyers Say</h1>
        <p className="page-banner-subtext">
          Real feedback from hotels, retailers, and caterers we supply across India.
        </p>
      </div>

      <div className="reviews-page">
        {loading ? (
          <p className="products-empty">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="products-empty">No reviews yet — be the first to share your experience.</p>
        ) : (
          <div className="testimonials-grid">
            {reviews.map((t) => (
              <div className="testimonial-card" key={t._id}>
                <div className="testimonial-rating">{"★".repeat(t.rating)}</div>
                <p className="testimonial-review">"{t.review}"</p>
                <p className="testimonial-name">{t.name}</p>
                {t.company && <p className="testimonial-business">{t.company}</p>}
              </div>
            ))}
          </div>
        )}

        <ReviewForm onSubmitted={loadReviews} />
      </div>
    </div>
  );
}

function ReviewForm({ onSubmitted }) {
  const [form, setForm] = useState({ name: "", company: "", rating: 5, review: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post("/reviews", form);
      setSubmitted(true);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong — please try again.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="review-form-card review-success">
        <p>Thanks, {form.name}! Your review will appear once approved.</p>
      </div>
    );
  }

  return (
    <form className="review-form-card" onSubmit={handleSubmit}>
      <h3 className="review-form-heading">Leave a Review</h3>
      {error && <p className="inquiry-error">{error}</p>}

      <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
      <input name="company" placeholder="Company Name (optional)" value={form.company} onChange={handleChange} />

      <div className="review-star-picker">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`review-star ${n <= form.rating ? "filled" : ""}`}
            onClick={() => setForm({ ...form, rating: n })}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        name="review"
        placeholder="Share your experience with Agriwhale..."
        rows={4}
        value={form.review}
        onChange={handleChange}
        required
      />

      <button type="submit" className="hero-cta" disabled={sending}>
        {sending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default Reviews;