export default function Topbar({ title, user, onMenu }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open navigation"><i className="bi bi-list" /></button>
      <div><div className="eyebrow">SHARED EXPENSES MADE SIMPLE</div><h1>{title}</h1></div>
      <div className="topbar-user"><div className="avatar avatar-small">{user.name.slice(0, 1).toUpperCase()}</div><span>{user.name}</span></div>
    </header>
  );
}
