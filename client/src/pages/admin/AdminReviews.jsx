import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AdminSubNav from "../../components/AdminSubNav";

function AdminReviews() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);

  const loadReviews = () => {
    api.get("/reviews/all").then((res) => setReviews(res.data));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStatus = async (id, status) => {
    await api.patch(`/reviews/${id}/approve`, { status });
    showToast(status === "approved" ? "Review approved" : "Review rejected");
    loadReviews();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await api.delete(`/reviews/${id}`);
    showToast("Review deleted");
    loadReviews();
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="section-heading">Reviews</h1>
        </div>
        <button onClick={logout} className="admin-logout-btn">
          Logout
        </button>
      </div>

      <AdminSubNav />

      <div className="admin-card">
        <h2 className="admin-card-heading">All Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="admin-form-hint">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div className="admin-review-item" key={r._id}>
              <div>
                <strong>{r.name}</strong>{" "}
                {r.company && <span style={{ color: "#888" }}>— {r.company}</span>}
                <div>{"★".repeat(r.rating)}</div>
                <p>{r.review}</p>
                <span className={`admin-review-status admin-review-${r.status}`}>
                  {r.status}
                </span>
              </div>
              <div className="admin-review-actions">
                {r.status !== "approved" && (
                  <button onClick={() => handleStatus(r._id, "approved")} className="hero-cta">
                    Approve
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button onClick={() => handleStatus(r._id, "rejected")} className="admin-delete-btn">
                    Reject
                  </button>
                )}
                <button onClick={() => handleDelete(r._id)} className="admin-delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminReviews;