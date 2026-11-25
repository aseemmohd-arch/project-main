export default function StatCard({ label, value, icon, tone = "green", hint }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><i className={`bi ${icon}`} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div>{hint && <div className="stat-hint">{hint}</div>}</div>;
}
