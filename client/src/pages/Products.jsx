import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Breadcrumbs from "../components/Breadcrumbs";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    });

  const handleFilter = (cat) => {
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div>
      <div className="page-banner">
        <span className="hero-badge">Our Range</span>
        <h1 className="page-banner-heading">Products</h1>
        <p className="page-banner-subtext">
          Browse our full catalog across Agri, Food, Retail, and Hospitality
          categories.
        </p>
      </div>

      <div className="products-page">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Products" }]} />

        <div className="products-search-row">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="products-search-input"
          />
        </div>

        {!loading && categories.length > 1 && (
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`category-tab ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="products-grid">
            {[...Array(6)].map((_, i) => (
              <div className="product-card-skeleton" key={i}>
                <div className="skeleton-block product-card-skeleton-image" />
                <div className="skeleton-block product-card-skeleton-line short" />
                <div className="skeleton-block product-card-skeleton-line" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="products-empty">
            {searchTerm
              ? `No products match "${searchTerm}".`
              : "No products yet — add some from the admin dashboard."}
          </p>
        ) : (
          <div className="products-grid">
            {filtered.map((p) => (
              <Link key={p._id} to={`/products/${p._id}`} className="product-card">
                <div className="product-card-image">
                  {p.images && p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} />
                  ) : (
                    <span>{p.category}</span>
                  )}
                </div>
                <div className="product-card-body">
                  <h3>{p.name}</h3>
                  <p className="product-card-category">{p.category}</p>
                  <div className="product-card-footer">
                    <span className="product-card-quote">Get Quote →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
