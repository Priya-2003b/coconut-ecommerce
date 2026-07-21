import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/inquiries", { product: id, message, quantity });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.category}</p>
      <p>{product.description}</p>
      <p>{product.priceNote}</p>

      {/* TODO: image gallery for product.images */}

      <h2>Send an Inquiry</h2>
      {submitted ? (
        <p>Thanks! We'll get back to you soon.</p>
      ) : (
        <form onSubmit={handleInquiry}>
          <input
            placeholder="Quantity needed (e.g. 50 kg)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">Send Inquiry</button>
        </form>
      )}

      {/* TODO: WhatsApp direct link as an alternative to the form, like Agriwhale does */}
    </div>
  );
}

export default ProductDetail;
