import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/inquiries/mine")
      .then((res) => setInquiries(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-banner">
        <span className="hero-badge">Your Account</span>
        <h1 className="page-banner-heading">My Inquiries</h1>
        <p className="page-banner-subtext">
          Track the quote requests you've sent us and their current status.
        </p>
      </div>

      <div className="inquiries-page">
        {loading ? (
          <p className="products-empty">Loading your inquiries...</p>
        ) : inquiries.length === 0 ? (
          <div className="inquiries-empty">
            <p>You haven't sent any inquiries yet.</p>
            <Link to="/products" className="hero-cta">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="inquiries-list">
            {inquiries.map((inq) => (
              <div className="inquiry-card" key={inq._id}>
                <div className="inquiry-card-header">
                  <h3>
                    {inq.product ? (
                      <Link to={`/products/${inq.product._id}`}>{inq.product.name}</Link>
                    ) : (
                      "Product no longer available"
                    )}
                  </h3>
                  <span className={`admin-status admin-status-${inq.status}`}>
                    {inq.status}
                  </span>
                </div>
                <p className="inquiry-card-quantity">Quantity: {inq.quantity || "Not specified"}</p>
                <p className="inquiry-card-message">{inq.message}</p>
                <p className="inquiry-card-date">
                  Sent on {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyInquiries;
