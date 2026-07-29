import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import AdminSubNav from "../../components/AdminSubNav";

function AdminDashboard() {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/inquiries").then((res) => setInquiries(res.data));
  }, []);

  const categoryCount = [...new Set(products.map((p) => p.category))].length;
  const pendingCount = inquiries.filter((i) => i.status === "pending").length;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="section-heading">Dashboard</h1>
        </div>
        <button onClick={logout} className="admin-logout-btn">
          Logout
        </button>
      </div>

      <AdminSubNav />

      <div className="admin-stats-grid">
        <Link to="/admin/products" className="admin-stat-card">
          <strong>{products.length}</strong>
          <span>Products</span>
        </Link>
        <Link to="/admin/categories" className="admin-stat-card">
          <strong>{categoryCount}</strong>
          <span>Categories</span>
        </Link>
        <Link to="/admin/inquiries" className="admin-stat-card">
          <strong>{inquiries.length}</strong>
          <span>Total Enquiries</span>
        </Link>
        <Link to="/admin/inquiries" className="admin-stat-card admin-stat-highlight">
          <strong>{pendingCount}</strong>
          <span>Pending Enquiries</span>
        </Link>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-heading">Quick Actions</h2>
        <div className="admin-quick-actions">
          <Link to="/admin/products" className="hero-cta">
            Manage Products
          </Link>
          <Link to="/admin/categories" className="hero-cta hero-cta-secondary-light">
            Manage Categories
          </Link>
          <Link to="/admin/inquiries" className="hero-cta hero-cta-secondary-light">
            View Enquiries
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
