import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import AdminSubNav from "../../components/AdminSubNav";

function AdminInquiries() {
  const { logout } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState("all");

  const loadInquiries = () => {
    api.get("/inquiries").then((res) => setInquiries(res.data));
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (inquiryId, newStatus) => {
    await api.put(`/inquiries/${inquiryId}`, { status: newStatus });
    setInquiries((prev) =>
      prev.map((inq) => (inq._id === inquiryId ? { ...inq, status: newStatus } : inq))
    );
  };

  const filtered =
    filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="section-heading">Enquiries</h1>
        </div>
        <button onClick={logout} className="admin-logout-btn">
          Logout
        </button>
      </div>

      <AdminSubNav />

      <div className="admin-card">
        <div className="admin-inquiry-filter-row">
          <h2 className="admin-card-heading">
            Customer Enquiries ({filtered.length})
          </h2>
          <div className="category-tabs" style={{ marginBottom: 0 }}>
            {["all", "pending", "contacted", "closed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`category-tab ${filter === f ? "active" : ""}`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-inquiry-list">
          {filtered.map((inq) => (
            <div className="admin-inquiry-row" key={inq._id}>
              <p className="admin-inquiry-meta">
                <strong>{inq.user?.name}</strong> ({inq.user?.phone || inq.user?.email})
                asked about <strong>{inq.product?.name || "a product"}</strong> —{" "}
                {inq.quantity}
              </p>
              <p className="admin-inquiry-message">{inq.message}</p>
              <div className="admin-inquiry-footer">
                <label className="admin-status-label">Status:</label>
                <select
                  value={inq.status}
                  onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                  className={`admin-status-select admin-status-${inq.status}`}
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="admin-form-hint">No enquiries match this filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminInquiries;
