import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

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
          <p className="products-empty">Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className="products-empty">
            No products yet — add some from the admin dashboard.
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
                    <p className="product-card-price">{p.priceNote}</p>
                    <span className="product-card-link">View Details →</span>
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
