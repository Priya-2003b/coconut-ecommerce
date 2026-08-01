// TODO: Style this to match the coconutwebsite.vercel.app reference layout
// Sections to build: Hero banner, About summary, Featured products, Gallery preview, Contact CTA

import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import HeroImageStack from "../components/HeroImageStack";

// Simple scroll-reveal hook: adds "in-view" class once an element enters the viewport
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// Counts a number up from 0 once it scrolls into view
function StatCounter({ end, suffix = "", label }) {
  const [ref, visible] = useReveal();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [visible, end]);

  return (
    <div className="stat-item" ref={ref}>
      <strong>
        {count}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

function Home() {
  const [featured, setFeatured] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [heroRef, heroVisible] = useReveal();
  const [pillarsRef, pillarsVisible] = useReveal();
  const [whyRef, whyVisible] = useReveal();
  const [testimonialsRef, testimonialsVisible] = useReveal();
  const location = useLocation();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setFeatured(res.data.slice(0, 4)))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
  api
    .get("/reviews")
    .then((res) => setReviews(res.data))
    .catch((err) => console.error(err));
  }, []);

  // Scroll to the section matching the URL hash (e.g. /#contact) once the page loads
      useEffect(() => {
      if (location.hash) {
        const id = location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    }, [location]);

      const sampleReviews = [
      {
        _id: "sample1",
        name: "Rajesh Kumar",
        company: "Kumar Hotels Pvt Ltd",
        rating: 5,
        review: "Consistent quality and on-time bulk delivery — Agriwhale has become our go-to supplier for coconuts and spices.",
      },
      {
        _id: "sample2",
        name: "Meena Rao",
        company: "Rao Foods & Catering",
        rating: 5,
        review: "The rice and dal quality is excellent, and pricing works well for our catering volumes.",
      },
      {
        _id: "sample3",
        name: "Sanjay Iyer",
        company: "Iyer Retail Mart",
        rating: 4,
        review: "Reliable sourcing and good communication. Great for a retail shop needing steady stock.",
      },
    ];


  return (
    <div>
      {/* Hero Section */}
      <section className={`hero ${heroVisible ? "in-view" : ""}`} ref={heroRef}>
        <div className="section-inner hero-inner">
          <div className="hero-content">
            <span className="hero-badge hero-fade-1">🌾 Est. in Trust, Grown with Care</span>
            <h1 className="hero-heading hero-fade-2">
              From Soil to Shelf,
              <br />
              <span className="hero-heading-accent">Honestly.</span>
            </h1>
            <p className="hero-subtext hero-fade-3">
              Premium agricultural products, sourced directly from trusted
              farmers — for wholesale, retail, and hospitality.
            </p>

            <ul className="trust-badges hero-fade-3">
              <li>✔ Farm Fresh</li>
              <li>✔ Premium Quality</li>
              <li>✔ Bulk Supply</li>
              <li>✔ PAN India Delivery</li>
            </ul>

            <div className="hero-cta-group hero-fade-4">
              <a href="/products" className="hero-cta">
                Explore Products
              </a>
              <a href="/#contact" className="hero-cta hero-cta-secondary">
                Get Wholesale Quote
              </a>
            </div>
          </div>

          <div className="hero-visual hero-fade-4">
            <HeroImageStack />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="stats-strip">
        <div className="section-inner stats-inner">
          <StatCounter end={500} suffix="+" label="Premium Products" />
          <StatCounter end={14} suffix="+" label="Partner Brands" />
          <StatCounter end={1000} suffix="+" label="Happy Customers" />
          <div className="stat-item">
            <strong>Bulk Supply</strong>
            <span>Across India</span>
          </div>
        </div>
      </div>

      {/* Four Pillars — Agriwhale's actual business verticals */}
      <section
        className={`pillars-section ${pillarsVisible ? "in-view" : ""}`}
        ref={pillarsRef}
      >
        <div className="section-inner">
          <span className="section-tag" style={{ textAlign: "center", display: "block" }}>
            Our Purpose
          </span>
          <h2 className="section-heading" style={{ textAlign: "center" }}>
            Four Pillars, One Promise
          </h2>
          <p className="pillars-subtext">
            From the farms we partner with to the kitchens and shelves we
            supply — everything we do sits on these four pillars.
          </p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon">🌾</div>
              <h3>Agri</h3>
              <p>Sourced directly from verified farms and trusted suppliers.</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">🍽️</div>
              <h3>Food</h3>
              <p>Quality-checked produce, grains, and spices — ready for your kitchen.</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">🛒</div>
              <h3>Retail</h3>
              <p>Bulk and small-quantity orders, priced fairly for every buyer.</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">🏨</div>
              <h3>Hospitality</h3>
              <p>Reliable, consistent supply for hotels, restaurants, and caterers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="categories-section">
        <div className="section-inner">
          <span className="section-tag" style={{ textAlign: "center", display: "block" }}>
            Browse
          </span>
          <h2 className="section-heading" style={{ textAlign: "center" }}>
            Product Categories
          </h2>

          <div className="categories-grid">
            {[
              { icon: "🌾", name: "Rice" },
              { icon: "🥜", name: "Dry Fruits" },
              { icon: "☕", name: "Coffee" },
              { icon: "🍵", name: "Tea" },
              { icon: "🌿", name: "Spices" },
              { icon: "🥥", name: "Coconut Products" },
              { icon: "🌱", name: "Pulses" },
            ].map((cat) => (
              <Link to="/products" key={cat.name} className="category-card">
                <div className="category-card-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      {/* <section className={`why-section ${whyVisible ? "in-view" : ""}`} ref={whyRef}>
        <div className="section-inner">
          <span className="section-tag" style={{ textAlign: "center", display: "block" }}>
            Our Promise
          </span>
          <h2 className="section-heading" style={{ textAlign: "center" }}>
            Why Choose Us
          </h2>

          <div className="why-grid">
            {[
              { icon: "🌱", title: "Direct Farmer Sourcing" },
              { icon: "⭐", title: "Premium Quality" },
              { icon: "💰", title: "Competitive Pricing" },
              { icon: "📦", title: "Bulk Orders" },
              { icon: "🚚", title: "Fast Delivery" },
              { icon: "🏨", title: "Trusted by Hospitality Industry" },
            ].map((item) => (
              <div className="why-card" key={item.title}>
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* About summary */}
      <section className="about-section" id="about">
        <div className="section-inner about-inner">
          <div className="about-content">
            <span className="section-tag">Who We Are</span>
            <h2 className="section-heading">
              Agriwhale — Purity you can Taste, Quality you can Trust!
            </h2>
            <p className="section-text about-lede">
              We exist to close the gap between farm and table — sourcing
              directly, verifying every batch, and delivering consistency our
              customers can build their own businesses on.
            </p>
            <p className="section-text">
              Agriwhale is a trusted name in premium agro and food products,
              committed to delivering purity, freshness, and consistent quality
              to our customers. We specialize in sourcing and supplying
              high-grade products such as Cashew Nuts (W320, JH, LWP, 8pc,
              Lali), Premium Cardamom (8mm), Kaveri Rice (Raw, Steam — 3 Years
              Old, Basmati), Tur Dal, Moong Dal (Split), Urad Dal (Gola/Split),
              Husk Coconuts, Dry Ball Kopra, Desiccated Coconut, Coffee Powder,
              and Tea Powder. Our products are carefully selected from reliable
              farmers and verified suppliers to ensure that every item meets
              quality standards in taste, aroma, and nutrition.
            </p>

            <ul className="about-features">
              <li>Premium Quality Products</li>
              <li>Bulk &amp; Retail Supply Available</li>
              <li>Sourced from Verified Farmers &amp; Suppliers</li>
            </ul>

            <a href="/#contact" className="about-cta">
              Get in Touch
            </a>
          </div>
          <div className="about-image">
            <img
              src="/images/about-products.png"
              alt="Agriwhale product range"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.classList.add("about-image-fallback");
              }}
            />
          </div>
        </div>
      </section>

      {/* Our Clients */}
      <section className="clients-section">
        <div className="section-inner">
          <span className="section-tag" style={{ textAlign: "center", display: "block" }}>
            Our Clients
          </span>
          <h2 className="section-heading" style={{ textAlign: "center" }}>
            Trusted by Leading Brands
          </h2>

          <div className="clients-marquee">
            <div className="clients-track">
              {[...Array(2)].map((_, dupIndex) => (
                <div className="clients-set" key={dupIndex}>
                  {Array.from({ length: 14 }, (_, i) => `${i + 1}.png`).map((logo) => (
                    <div className="client-logo" key={`${dupIndex}-${logo}`}>
                      <img src={`/images/clients/${logo}`} alt="Client logo" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-inner">
          <span className="section-tag" style={{ textAlign: "center", display: "block" }}>
            Our Range
          </span>
          <h2 className="section-heading" style={{ textAlign: "center" }}>
            Featured Products
          </h2>

          {featured.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>
              Products will appear here once added from the admin dashboard.
            </p>
          ) : (
            <div className="featured-grid">
              {featured.map((p) => (
                <Link to={`/products/${p._id}`} key={p._id} className="featured-card">
                  <div className="featured-card-image">
                    {p.images && p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} />
                    ) : (
                      <span>{p.category}</span>
                    )}
                  </div>
                  <div className="featured-card-body">
                    <h3>{p.name}</h3>
                    <p className="featured-card-category">{p.category}</p>
                    <span className="featured-card-link">Get Quote →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link to="/products" className="hero-cta">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials teaser */}
      <section
        className={`testimonials-section ${testimonialsVisible ? "in-view" : ""}`}
        ref={testimonialsRef}
      >
        <div className="section-inner">
          <span className="section-tag" style={{ textAlign: "center", display: "block" }}>
            Customer Stories
          </span>
          <h2 className="section-heading" style={{ textAlign: "center" }}>
            What Our Buyers Say
          </h2>

          <div className="testimonials-grid">
            {(reviews.length === 0 ? sampleReviews : reviews.slice(0, 3)).map((t) => (
              <div className="testimonial-card" key={t._id}>
                <div className="testimonial-rating">{"★".repeat(t.rating)}</div>
                <p className="testimonial-review">"{t.review}"</p>
                <p className="testimonial-name">{t.name}</p>
                {t.company && <p className="testimonial-business">{t.company}</p>}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link to="/reviews" className="hero-cta">
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="section-inner">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="section-tag">Get in Touch</span>
              <h2 className="section-heading">Let's Talk Business</h2>
              <p className="section-text">
                Have a bulk order, wholesale inquiry, or just a question about
                our products? Reach out — we typically respond within a
                business day.
              </p>

              <div className="contact-detail-row">
                <span>📞</span>
                <a href="tel:+919148249999">+91 9148249999</a>
              </div>
              <div className="contact-detail-row">
                <span>✉️</span>
                <a href="mailto:info@agriwhale.com">info@agriwhale.com</a>
              </div>
              <div className="contact-detail-row">
                <span>📍</span>
                <p>
                  No.41, GR Kalyana Mantap, Hebbal Address ORR, Bangalore -
                  560094
                </p>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/919148249999"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        💬
      </a>
    </div>
  );
}

// Review submission form — new reviews go in as "pending" until admin approves them
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

      <input
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="company"
        placeholder="Company Name (optional)"
        value={form.company}
        onChange={handleChange}
      />

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
// Contact form — sends to backend, which emails the message via Nodemailer.
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post("/contact", form);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong — please try again."
      );
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-form-card contact-success">
        <p>Thanks, {form.name}! We'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form className="contact-form-card" onSubmit={handleSubmit}>
      {error && <p className="inquiry-error">{error}</p>}
      <input
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        rows={5}
        value={form.message}
        onChange={handleChange}
        required
      />
      <button type="submit" className="hero-cta" disabled={sending}>
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default Home;