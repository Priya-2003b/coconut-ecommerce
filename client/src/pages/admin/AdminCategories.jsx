import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AdminSubNav from "../../components/AdminSubNav";

function AdminCategories() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const loadData = () => {
    api.get("/categories").then((res) => setCategories(res.data));
    api.get("/products").then((res) => setProducts(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const productCountFor = (name) =>
    products.filter((p) => p.category === name).length;

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    try {
      await api.post("/categories", { name: newCategoryInput.trim() });
      showToast(`Added category "${newCategoryInput.trim()}"`);
      setNewCategoryInput("");
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add category", "error");
    }
  };

  const startRename = (cat) => {
    setRenamingId(cat._id);
    setRenameValue(cat.name);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const handleRename = async (e, id) => {
    e.preventDefault();
    if (!renameValue.trim()) return;
    const res = await api.put(`/categories/${id}`, { name: renameValue.trim() });
    showToast(`${res.data.message} (${res.data.modifiedCount} product(s) updated)`);
    cancelRename();
    loadData();
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await api.delete(`/categories/${cat._id}`);
      showToast(`Deleted category "${cat.name}"`);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete category", "error");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="section-heading">Categories</h1>
        </div>
        <button onClick={logout} className="admin-logout-btn">
          Logout
        </button>
      </div>

      <AdminSubNav />

      <div className="admin-card">
        <h2 className="admin-card-heading">Add Category</h2>
        <form onSubmit={handleAddCategory} className="admin-add-category-form">
          <input
            placeholder="New category name (e.g. Rice)"
            value={newCategoryInput}
            onChange={(e) => setNewCategoryInput(e.target.value)}
          />
          <button type="submit" className="hero-cta">
            Add Category
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-heading">All Categories ({categories.length})</h2>

        <div className="admin-category-list">
          {categories.map((cat) => {
            const count = productCountFor(cat.name);
            return (
              <div className="admin-category-row" key={cat._id}>
                {renamingId === cat._id ? (
                  <form
                    onSubmit={(e) => handleRename(e, cat._id)}
                    className="admin-category-rename-form"
                  >
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="admin-edit-btn">
                      Save
                    </button>
                    <button type="button" onClick={cancelRename} className="admin-cancel-btn">
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="admin-category-name">
                      {cat.name} <span className="admin-category-count">({count} products)</span>
                    </span>
                    <div className="admin-category-actions">
                      <button onClick={() => startRename(cat)} className="admin-edit-btn">
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="admin-delete-btn"
                        disabled={count > 0}
                        title={count > 0 ? "Reassign or delete its products first" : ""}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="admin-form-hint">No categories yet — add your first one above.</p>
          )}
        </div>

        <p className="admin-form-hint" style={{ marginTop: "1rem" }}>
          You can only delete a category once no products use it. Renaming
          updates it across every product automatically.
        </p>
      </div>
    </div>
  );
}

export default AdminCategories;
