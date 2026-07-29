import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Breadcrumbs from "../components/Breadcrumbs";

// Simple icon mapping for common category names — falls back to a generic icon
const iconFor = (name) => {
  const key = name.toLowerCase();
  if (key.includes("cashew") || key.includes("dry fruit")) return "🥜";
  if (key.includes("rice")) return "🌾";
  if (key.includes("dal") || key.includes("pulse")) return "🌱";
  if (key.includes("coconut") || key.includes("kopra")) return "🥥";
  if (key.includes("coffee")) return "☕";
  if (key.includes("tea")) return "🍵";
  if (key.includes("cardamom") || key.includes("spice")) return "🌿";
  return "📦";
};

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/categories"), api.get("/products")])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data);
        setProducts(prodRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const countFor = (name) => products.filter((p) => p.category === name).length;

  return (
    <div>
      <div className="page-banner">
        <span className="hero-badge">Browse</span>
        <h1 className="page-banner-heading">Categories</h1>
        <p className="page-banner-subtext">
          Explore our full range by category — from dry fruits and spices to
          rice, pulses, and coconut products.
        </p>
      </div>

      <div className="categories-page">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Categories" }]} />

        {loading ? (
          <div className="categories-page-grid">
            {[...Array(6)].map((_, i) => (
              <div className="category-page-card-skeleton" key={i}>
                <div className="skeleton-block" style={{ width: "40px", height: "40px", borderRadius: "50%", margin: "0 auto 1rem" }} />
                <div className="skeleton-block skeleton-block-line" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="products-empty">
            No categories yet — check back soon.
          </p>
        ) : (
          <div className="categories-page-grid">
            {categories.map((cat) => (
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                key={cat._id}
                className="category-page-card"
              >
                <div className="category-page-icon">{iconFor(cat.name)}</div>
                <h3>{cat.name}</h3>
                <p>{countFor(cat.name)} product(s)</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;
