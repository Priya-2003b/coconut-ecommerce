import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Link to="/" className="navbar-logo">
        AGRIWHALE
        <span className="navbar-tagline">Agri · Food · Retail · Hospitality</span>
      </Link>

      <div className="navbar-center">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/products">Categories</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/#about">About</Link>
        <Link to="/#contact">Contact</Link>
      </div>

      <div className="navbar-right">
        {/* Not logged in */}
        {!user && (
          <>
            <Link to="/login" className="navbar-account-link">
              Login
            </Link>
            <Link to="/signup" className="navbar-account-link">
              Sign Up
            </Link>
          </>
        )}

        {/* Logged in as customer */}
        {user && !isAdmin && (
          <Link to="/my-inquiries" className="navbar-account-link">
            My Inquiries
          </Link>
        )}

        {/* Logged in as admin */}
        {user && isAdmin && (
          <Link to="/admin/dashboard" className="navbar-account-link">
            Admin Dashboard
          </Link>
        )}

        {user ? (
          <button onClick={handleLogout} className="navbar-btn">
            Logout
          </button>
        ) : (
          <a href="/#contact" className="navbar-btn">
            Enquire Now
          </a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
