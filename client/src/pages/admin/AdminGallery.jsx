import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AdminSubNav from "../../components/AdminSubNav";

function AdminGallery() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadImages = () => {
    api.get("/gallery").then((res) => setImages(res.data));
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/gallery", { imageUrl, caption });
      showToast("Image added to gallery");
      setImageUrl("");
      setCaption("");
      loadImages();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add image", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this image from the gallery?")) return;
    await api.delete(`/gallery/${id}`);
    showToast("Image removed");
    loadImages();
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="section-heading">Gallery</h1>
        </div>
        <button onClick={logout} className="admin-logout-btn">
          Logout
        </button>
      </div>

      <AdminSubNav />

      <div className="admin-card">
        <h2 className="admin-card-heading">Add Image</h2>
        <form onSubmit={handleAdd} className="admin-form">
          <input
            placeholder="Image URL (paste from Imgur or similar)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />

          {imageUrl.trim() && (
            <div className="admin-image-preview">
              <img src={imageUrl} alt="Preview" />
            </div>
          )}

          <input
            placeholder="Caption (optional, e.g. 'Cashew farm visit')"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <div className="admin-form-actions">
            <button type="submit" className="hero-cta" disabled={submitting}>
              {submitting ? "Adding..." : "Add to Gallery"}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-heading">Gallery Images ({images.length})</h2>
        {images.length === 0 ? (
          <p className="admin-form-hint">No images yet — add your first one above.</p>
        ) : (
          <div className="admin-gallery-grid">
            {images.map((img) => (
              <div className="admin-gallery-item" key={img._id}>
                <img src={img.imageUrl} alt={img.caption || "Gallery image"} />
                {img.caption && <p className="admin-gallery-caption">{img.caption}</p>}
                <button
                  onClick={() => handleDelete(img._id)}
                  className="admin-delete-btn admin-gallery-delete"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGallery;
