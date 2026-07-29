import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AdminSubNav from "../../components/AdminSubNav";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  priceNote: "",
  unit: "kg",
  imageUrls: [""], // multiple image URL slots
  specs: [],
};

function AdminProducts() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadProducts = () => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/categories").then((res) => setCategories(res.data));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  // Image URL row helpers
  const updateImageRow = (index, value) => {
    const updated = [...form.imageUrls];
    updated[index] = value;
    setForm({ ...form, imageUrls: updated });
  };

  const addImageRow = () => {
    setForm({ ...form, imageUrls: [...form.imageUrls, ""] });
  };

  const removeImageRow = (index) => {
    const updated = form.imageUrls.filter((_, i) => i !== index);
    setForm({ ...form, imageUrls: updated.length > 0 ? updated : [""] });
  };

  // Spec row helpers
  const addSpecRow = () => {
    setForm({ ...form, specs: [...form.specs, { key: "", value: "" }] });
  };

  const updateSpecRow = (index, field, value) => {
    const updated = [...form.specs];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, specs: updated });
  };

  const removeSpecRow = (index) => {
    setForm({ ...form, specs: form.specs.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanSpecs = form.specs.filter((s) => s.key.trim() && s.value.trim());
    const cleanImages = form.imageUrls.map((u) => u.trim()).filter(Boolean);

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      priceNote: form.priceNote,
      unit: form.unit,
      images: cleanImages,
      specs: cleanSpecs,
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        showToast("Product updated");
      } else {
        await api.post("/products", payload);
        showToast("Product added");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      priceNote: p.priceNote || "",
      unit: p.unit || "kg",
      imageUrls: p.images && p.images.length > 0 ? p.images : [""],
      specs: p.specs && p.specs.length > 0 ? p.specs : [],
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await api.delete(`/products/${id}`);
    if (editingId === id) resetForm();
    loadProducts();
    showToast("Product deleted");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="section-heading">Products</h1>
        </div>
        <button onClick={logout} className="admin-logout-btn">
          Logout
        </button>
      </div>

      <AdminSubNav />

      <div className="admin-card">
        <h2 className="admin-card-heading">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <input
              name="name"
              placeholder="Product name (e.g. W320 Cashew Nuts)"
              value={form.name}
              onChange={handleChange}
              required
            />
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option value={cat.name} key={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {categories.length === 0 ? (
            <p className="admin-form-hint">
              No categories yet —{" "}
              <Link to="/admin/categories">add one on the Categories page</Link>{" "}
              before adding a product.
            </p>
          ) : (
            <p className="admin-form-hint">
              Don't see the category you need?{" "}
              <Link to="/admin/categories">Add a new one here</Link>.
            </p>
          )}

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
          />

          {/* Multiple image URLs */}
          <div className="admin-specs-section">
            <div className="admin-specs-header">
              <label>Product Images</label>
              <button type="button" onClick={addImageRow} className="admin-add-spec-btn">
                + Add Image
              </button>
            </div>

            {form.imageUrls.map((url, i) => (
              <div className="admin-image-row" key={i}>
                <input
                  placeholder={`Image URL ${i + 1} (from Imgur or similar)`}
                  value={url}
                  onChange={(e) => updateImageRow(i, e.target.value)}
                />
                {url.trim() && (
                  <div className="admin-image-preview-small">
                    <img src={url} alt={`Preview ${i + 1}`} />
                  </div>
                )}
                {form.imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageRow(i)}
                    className="admin-remove-spec-btn"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <p className="admin-form-hint">
              First image is used as the main thumbnail. Add more for a gallery on the product page.
            </p>
          </div>

          <div className="admin-form-row">
            <input
              name="priceNote"
              placeholder="Internal price note (not shown publicly)"
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

          <div className="admin-specs-section">
            <div className="admin-specs-header">
              <label>Specifications (optional)</label>
              <button type="button" onClick={addSpecRow} className="admin-add-spec-btn">
                + Add Spec
              </button>
            </div>

            {form.specs.length === 0 && (
              <p className="admin-form-hint">
                E.g. Type: Whole, Grade: W210, Shelf Life: 6 Months
              </p>
            )}

            {form.specs.map((spec, i) => (
              <div className="admin-spec-row" key={i}>
                <input
                  placeholder="Label (e.g. Grade)"
                  value={spec.key}
                  onChange={(e) => updateSpecRow(i, "key", e.target.value)}
                />
                <input
                  placeholder="Value (e.g. W210)"
                  value={spec.value}
                  onChange={(e) => updateSpecRow(i, "value", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(i)}
                  className="admin-remove-spec-btn"
                  aria-label="Remove spec"
                >
                  ✕
                </button>
              </div>
            ))}
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
                  {p.category}
                  {p.images && p.images.length > 0 ? ` — ${p.images.length} image(s)` : ""}
                  {p.specs && p.specs.length > 0 ? ` — ${p.specs.length} spec(s)` : ""}
                </p>
              </div>
              <div className="admin-product-actions">
                <button onClick={() => handleEdit(p)} className="admin-edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id, p.name)} className="admin-delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="admin-form-hint">No products yet — add your first one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
