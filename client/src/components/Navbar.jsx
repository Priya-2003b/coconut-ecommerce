import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const isOnAdminPage = location.pathname.startsWith("/admin");

  // Admin gets a distinct, simplified navbar — but ONLY while actually inside
  // the /admin section. Browsing the public site (even while logged in as
  // admin) should show the normal customer navbar so Home/Products/etc. work.
  if (isAdmin && isOnAdminPage) {
    return (
      <nav className="navbar navbar-admin">
        <Link to="/admin/dashboard" className="navbar-logo">
          AGRIWHALE
          <span className="navbar-tagline navbar-admin-badge">Admin Mode</span>
        </Link>

        <div className="navbar-right">
          <Link to="/admin/dashboard" className="navbar-account-link">
            Dashboard
          </Link>
          <Link to="/" className="navbar-account-link">
            View Live Site ↗
          </Link>
          <button onClick={handleLogout} className="navbar-btn">
            Logout
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Link to="/" className="navbar-logo">
        AGRIWHALE
        <span className="navbar-tagline">Agri · Food · Retail · Hospitality</span>
      </Link>

      <div className="navbar-center">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")}>
          Products
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? "active" : "")}>
          Categories
        </NavLink>
        <NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : "")}>
          Gallery
        </NavLink>
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

        {/* Admin browsing the public site */}
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
