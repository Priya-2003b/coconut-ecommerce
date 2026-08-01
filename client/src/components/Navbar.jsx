import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isOnAdminPage = location.pathname.startsWith("/admin");

  if (isAdmin && isOnAdminPage) {
    return (
      <nav className="navbar navbar-admin">
        <Link to="/admin/dashboard" className="navbar-logo">
          <img src="/images/logo.png" alt="Agriwhale" className="navbar-logo-img" />
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
        <img src="/images/logo.png" alt="Agriwhale" className="navbar-logo-img" />
      </Link>

      <button
        className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
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

          {user && !isAdmin && (
            <Link to="/my-inquiries" className="navbar-account-link">
              My Inquiries
            </Link>
          )}

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
      </div>
    </nav>
  );
}

export default Navbar;