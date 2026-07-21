import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1>Our Products</h1>
      {/* TODO: category filter sidebar/tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {products.map((p) => (
          <Link key={p._id} to={`/products/${p._id}`}>
            <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
              {/* TODO: product image */}
              <h3>{p.name}</h3>
              <p>{p.category}</p>
              <p>{p.priceNote}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;
