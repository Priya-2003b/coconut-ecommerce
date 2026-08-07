import { useEffect, useState } from "react";
import api from "../api/axios";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/gallery")
      .then((res) => setImages(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-banner">
        <span className="hero-badge">A Glimpse Inside</span>
        <h1 className="page-banner-heading">Gallery</h1>
        <p className="page-banner-subtext">
          Farm visits, product close-ups, and behind-the-scenes at Agriwhale.
        </p>
      </div>

      <div className="gallery-page">
        {loading ? (
          <p className="products-empty">Loading gallery...</p>
        ) : images.length === 0 ? (
          <p className="products-empty">Photos coming soon.</p>
        ) : (
          <div className="gallery-grid">
            {images.map((img) => (
              <div className="gallery-item" key={img._id}>
                <img src={img.imageUrl} alt={img.caption || "Agriwhale gallery"} />
                {img.caption && <p className="gallery-caption">{img.caption}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;