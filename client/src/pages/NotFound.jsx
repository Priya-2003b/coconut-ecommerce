import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <span className="hero-badge" style={{ borderColor: "#a67c00" }}>
        404
      </span>
      <h1 className="section-heading">Page Not Found</h1>
      <p className="not-found-text">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="not-found-actions">
        <Link to="/" className="hero-cta">
          Back to Home
        </Link>
        <Link to="/products" className="hero-cta hero-cta-secondary-light">
          Browse Products
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
