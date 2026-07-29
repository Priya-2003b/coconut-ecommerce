import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Breadcrumbs from "../components/Breadcrumbs";

function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSubmitted(false);
    setMessage("");
    setQuantity("");
    setError("");
    setActiveImage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });

    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      api.get(`/products?category=${encodeURIComponent(res.data.category)}`).then((r) => {
        setRelated(r.data.filter((p) => p._id !== id).slice(0, 3));
      });
    });
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await api.post("/inquiries", { product: id, message, quantity });
      setSubmitted(true);
      showToast("Quote request sent!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="product-detail-skeleton">
        <div className="skeleton-image" />
        <div className="skeleton-lines">
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${product.name}. Could you share more details?`
  );

  return (
    <div>
      <div className="product-detail">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Products", to: "/products" },
            { label: product.category, to: `/products?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />

        <div className="product-detail-grid">
          <div className="product-detail-gallery">
            <div className="product-detail-image">
              {images.length > 0 ? (
                <img src={images[activeImage]} alt={product.name} />
              ) : (
                <span>{product.category}</span>
              )}
            </div>

            {images.length > 1 && (
              <div className="product-thumb-strip">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-thumb ${i === activeImage ? "active" : ""}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <span className="section-tag">{product.category}</span>
            <h1 className="section-heading" style={{ marginBottom: "0.5rem" }}>
              {product.name}
            </h1>
            <p className="product-detail-quote-note">💬 Get a custom quote based on your quantity</p>

            {product.specs && product.specs.length > 0 && (
              <table className="spec-table">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr key={i}>
                      <td className="spec-table-key">{spec.key}</td>
                      <td className="spec-table-value">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <p className="product-detail-description">{product.description}</p>

            <ul className="trust-badges product-detail-badges">
              <li>✔ Farm Fresh</li>
              <li>✔ Premium Quality</li>
              <li>✔ Bulk Supply Available</li>
            </ul>

            <a
              href={`https://wa.me/919148249999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta"
              style={{ display: "inline-block", marginBottom: "2rem" }}
            >
              Chat on WhatsApp
            </a>

            <div className="inquiry-box" id="quote-form">
              <h2 className="inquiry-heading">Request a Quote</h2>
              {submitted ? (
                <p className="inquiry-success">
                  Thanks! We'll get back to you with pricing shortly.
                </p>
              ) : (
                <form onSubmit={handleInquiry} className="inquiry-form">
                  {error && <p className="inquiry-error">{error}</p>}
                  <input
                    placeholder="Required quantity (e.g. 50 kg)"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Any additional details (delivery location, timeline, etc.)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                  />
                  <button
                    type="submit"
                    className="hero-cta inquiry-submit"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Get Quote"}
                  </button>
                  {!user && (
                    <p className="inquiry-note">
                      You'll be asked to log in first.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related-section">
          <span className="section-tag" style={{ textAlign: "center", display: "block" }}>
            You May Also Like
          </span>
          <h2 className="section-heading" style={{ textAlign: "center" }}>
            More in {product.category}
          </h2>

          <div className="products-grid related-grid">
            {related.map((p) => (
              <Link key={p._id} to={`/products/${p._id}`} className="product-card">
                <div className="product-card-image">
                  {p.images && p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} />
                  ) : (
                    <span>{p.category}</span>
                  )}
                </div>
                <div className="product-card-body">
                  <h3>{p.name}</h3>
                  <p className="product-card-category">{p.category}</p>
                  <div className="product-card-footer">
                    <span className="product-card-quote">Get Quote →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile Enquire bar */}
      <a href="#quote-form" className="mobile-sticky-enquire">
        Get Quote
      </a>
    </div>
  );
}

export default ProductDetail;
