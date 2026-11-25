import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = e => { e.preventDefault(); setError(onLogin(email, password)); };
  return (
    <div className="auth-layout">
      <section className="auth-story"><div className="brand brand-light"><span className="brand-mark"><i className="bi bi-arrow-left-right" /></span>SplitWise</div><div className="story-copy"><span className="pill">LESS MATH. MORE MEMORIES.</span><h1>Good times are better when expenses are <em>easy.</em></h1><p>Keep shared costs organised, understand balances and settle up with your group.</p></div><div className="story-foot">A simple way to stay on the same page.</div></section>
      <section className="auth-panel"><form className="auth-form" onSubmit={submit}><div className="eyebrow">WELCOME BACK</div><h2>Sign in to SplitWise</h2><p className="muted">Enter your details to access your account.</p>{error && <div className="alert alert-danger py-2">{error}</div>}<label>Email address<input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required /></label><button className="btn btn-brand w-100" type="submit">Sign in <i className="bi bi-arrow-right ms-2" /></button><div className="auth-switch">New to SplitWise? <Link to="/signup">Create an account</Link></div><div className="demo-box"><strong>Demo admin account</strong><span>admin@splitwise.com</span><span>admin123</span></div></form></section>
    </div>
  );
}
