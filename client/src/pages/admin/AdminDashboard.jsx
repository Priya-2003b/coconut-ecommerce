import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", description: "", priceNote: "", unit: "kg" });

  const loadData = () => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/inquiries").then((res) => setInquiries(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    setForm({ name: "", category: "", description: "", priceNote: "", unit: "kg" });
    loadData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    loadData();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <h2>Add Product</h2>
      <form onSubmit={handleAddProduct}>
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="priceNote" placeholder="Price note (e.g. ₹120/kg)" value={form.priceNote} onChange={handleChange} />
        <input name="unit" placeholder="Unit (kg, piece...)" value={form.unit} onChange={handleChange} />
        <button type="submit">Add Product</button>
      </form>

      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.name} ({p.category}) — {p.priceNote}
            <button onClick={() => handleDelete(p._id)}>Delete</button>
            {/* TODO: Edit functionality */}
          </li>
        ))}
      </ul>

      <h2>Customer Inquiries</h2>
      <ul>
        {inquiries.map((inq) => (
          <li key={inq._id}>
            <strong>{inq.user?.name}</strong> ({inq.user?.phone || inq.user?.email}) asked about{" "}
            <strong>{inq.product?.name}</strong> — {inq.quantity} — status: {inq.status}
            <p>{inq.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
