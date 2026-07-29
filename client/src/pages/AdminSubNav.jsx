import { NavLink } from "react-router-dom";

function AdminSubNav() {
  return (
    <div className="admin-subnav">
      <NavLink
        to="/admin/dashboard"
        end
        className={({ isActive }) => `admin-subnav-link ${isActive ? "active" : ""}`}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/admin/products"
        className={({ isActive }) => `admin-subnav-link ${isActive ? "active" : ""}`}
      >
        Products
      </NavLink>
      <NavLink
        to="/admin/categories"
        className={({ isActive }) => `admin-subnav-link ${isActive ? "active" : ""}`}
      >
        Categories
      </NavLink>
      <NavLink
        to="/admin/inquiries"
        className={({ isActive }) => `admin-subnav-link ${isActive ? "active" : ""}`}
      >
        Enquiries
      </NavLink>
      <NavLink
        to="/admin/gallery"
        className={({ isActive }) => `admin-subnav-link ${isActive ? "active" : ""}`}
      >
        Gallery
      </NavLink>
    </div>
  );
}

export default AdminSubNav;
