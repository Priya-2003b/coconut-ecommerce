import { useEffect, useState } from "react";
import api from "../api/axios";

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    api.get("/inquiries/mine").then((res) => setInquiries(res.data));
  }, []);

  return (
    <div>
      <h1>My Inquiries</h1>
      {inquiries.length === 0 && <p>No inquiries yet.</p>}
      <ul>
        {inquiries.map((inq) => (
          <li key={inq._id}>
            <strong>{inq.product?.name}</strong> — {inq.quantity} — {inq.status}
            <p>{inq.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyInquiries;
