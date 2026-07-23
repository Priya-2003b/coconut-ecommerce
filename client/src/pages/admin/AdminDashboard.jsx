import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    priceNote: "",
    unit: "kg",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/inquiries").then((res) => setInquiries(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ name: "", category: "", description: "", priceNote: "", unit: "kg", imageUrl: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      priceNote: form.priceNote,
      unit: form.unit,
      images: form.imageUrl ? [form.imageUrl] : [],
    };

    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post("/products", payload);
    }
    resetForm();
    loadData();
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      priceNote: p.priceNote || "",
      unit: p.unit || "kg",
      imageUrl: p.images && p.images[0] ? p.images[0] : "",
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    if (editingId === id) resetForm();
    loadData();
  };

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

      <div className="admin-card">
        <h2 className="admin-card-heading">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <input
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="category"
              placeholder="Category (e.g. Cashew Nuts)"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
          />

          <input
            name="imageUrl"
            placeholder="Image URL (paste from Imgur or similar)"
            value={form.imageUrl}
            onChange={handleChange}
          />

          {form.imageUrl && (
            <div className="admin-image-preview">
              <img src={form.imageUrl} alt="Preview" />
            </div>
          )}

          <div className="admin-form-row">
            <input
              name="priceNote"
              placeholder="Price note (e.g. ₹850/kg)"
              value={form.priceNote}
              onChange={handleChange}
            />
            <input
              name="unit"
              placeholder="Unit (kg, piece...)"
              value={form.unit}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="hero-cta">
              {editingId ? "Save Changes" : "Add Product"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-heading">Products ({products.length})</h2>
        <div className="admin-product-list">
          {products.map((p) => (
            <div className="admin-product-row" key={p._id}>
              <div className="admin-product-thumb">
                {p.images && p.images[0] ? (
                  <img src={p.images[0]} alt={p.name} />
                ) : (
                  <span>{p.category}</span>
                )}
              </div>
              <div className="admin-product-info">
                <h3>{p.name}</h3>
                <p>
                  {p.category} — {p.priceNote}
                </p>
              </div>
              <div className="admin-product-actions">
                <button onClick={() => handleEdit(p)} className="admin-edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="admin-delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-heading">Customer Inquiries ({inquiries.length})</h2>
        <div className="admin-inquiry-list">
          {inquiries.map((inq) => (
            <div className="admin-inquiry-row" key={inq._id}>
              <p className="admin-inquiry-meta">
                <strong>{inq.user?.name}</strong> ({inq.user?.phone || inq.user?.email})
                asked about <strong>{inq.product?.name}</strong> — {inq.quantity} —{" "}
                <span className={`admin-status admin-status-${inq.status}`}>
                  {inq.status}
                </span>
              </p>
              <p className="admin-inquiry-message">{inq.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
