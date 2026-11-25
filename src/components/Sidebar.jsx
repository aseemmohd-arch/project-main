import { NavLink } from "react-router-dom";

const links = [
  { to: "/", icon: "bi-grid-1x2", label: "Dashboard" },
  { to: "/groups", icon: "bi-people", label: "Groups" },
  { to: "/expenses", icon: "bi-receipt", label: "Expenses" },
  { to: "/settlements", icon: "bi-arrow-left-right", label: "Settlements" },
  { to: "/profile", icon: "bi-person", label: "My Profile" }
];

export default function Sidebar({ user, mobileOpen, closeMobile, onLogout }) {
  return (
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><span className="brand-mark"><i className="bi bi-arrow-left-right" /></span><span>SplitWise</span></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="side-nav">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === "/"} onClick={closeMobile}>
            <i className={`bi ${link.icon}`} /><span>{link.label}</span>
          </NavLink>
        ))}
        {user.role === "admin" && <NavLink to="/admin" onClick={closeMobile}><i className="bi bi-shield-check" /><span>Admin Panel</span></NavLink>}
      </nav>
      <div className="sidebar-bottom">
        <div className="profile-mini"><div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div><div className="profile-mini-text"><strong>{user.name}</strong><small>{user.role}</small></div></div>
        <button className="logout-link" onClick={onLogout}><i className="bi bi-box-arrow-right" /> Sign out</button>
      </div>
    </aside>
  );
}
