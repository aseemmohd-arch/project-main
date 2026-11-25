import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Groups from "./pages/Groups.jsx";
import Expenses from "./pages/Expenses.jsx";
import Settlements from "./pages/Settlements.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";

const ADMIN = {
  id: "demo-admin",
  name: "Administrator",
  email: "admin@splitwise.com",
  password: "admin123",
  role: "admin"
};

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function AppShell({ user, onLogout, data, actions }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const titles = {
    "/": "Dashboard",
    "/groups": "Groups",
    "/expenses": "Expenses",
    "/settlements": "Settlements",
    "/profile": "My Profile",
    "/admin": "Admin Dashboard"
  };
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar user={user} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} onLogout={onLogout} />
      {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <main className="main-area">
        <Topbar title={titles[location.pathname] || "SplitWise"} user={user} onMenu={() => setMobileOpen(true)} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard user={user} {...data} />} />
            <Route path="/groups" element={<Groups user={user} {...data} {...actions} />} />
            <Route path="/expenses" element={<Expenses user={user} {...data} {...actions} />} />
            <Route path="/settlements" element={<Settlements user={user} {...data} {...actions} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/admin" element={user.role === "admin" ? <Admin {...data} /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const [users, setUsers] = useState(() => {
    const stored = read("sw_users", []);
    const others = stored.filter(u => u.email?.toLowerCase() !== ADMIN.email);
    return [ADMIN, ...others];
  });
  const [groups, setGroups] = useState(() => read("sw_groups", []));
  const [expenses, setExpenses] = useState(() => read("sw_expenses", []));
  const [settlements, setSettlements] = useState(() => read("sw_settlements", []));
  const [user, setUser] = useState(() => read("sw_current_user", null));
  const navigate = useNavigate();

  useEffect(() => localStorage.setItem("sw_users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("sw_groups", JSON.stringify(groups)), [groups]);
  useEffect(() => localStorage.setItem("sw_expenses", JSON.stringify(expenses)), [expenses]);
  useEffect(() => localStorage.setItem("sw_settlements", JSON.stringify(settlements)), [settlements]);
  useEffect(() => {
    if (user) localStorage.setItem("sw_current_user", JSON.stringify(user));
    else localStorage.removeItem("sw_current_user");
  }, [user]);

  const login = (email, password) => {
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!found) return "Email or password is incorrect.";
    setUser(found);
    navigate("/");
    return "";
  };

  const signup = (name, email, password) => {
    const normalized = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === normalized)) return "An account with this email already exists.";
    const created = { id: crypto.randomUUID(), name: name.trim(), email: normalized, password, role: "user" };
    setUsers(current => [...current, created]);
    setUser(created);
    navigate("/");
    return "";
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  const visibleGroups = useMemo(
    () => user?.role === "admin" ? groups : groups.filter(g => g.memberIds.includes(user?.id)),
    [groups, user]
  );
  const visibleExpenses = useMemo(
    () => expenses.filter(e => visibleGroups.some(g => g.id === e.groupId)),
    [expenses, visibleGroups]
  );

  const addGroup = (name, memberIds) => {
    const uniqueMembers = [...new Set([user.id, ...memberIds])];
    setGroups(current => [...current, {
      id: crypto.randomUUID(), name: name.trim(), memberIds: uniqueMembers,
      createdBy: user.id, createdAt: new Date().toISOString()
    }]);
  };

  const addExpense = (expense) => {
    const group = groups.find(g => g.id === expense.groupId);
    if (!group || !group.memberIds.includes(user.id)) return "Choose one of your groups.";
    const amount = Number(expense.amount);
    if (!expense.description.trim() || !Number.isFinite(amount) || amount <= 0) return "Enter a valid description and amount.";
    const created = {
      id: crypto.randomUUID(), description: expense.description.trim(), amount,
      groupId: group.id, paidBy: expense.paidBy, createdBy: user.id,
      date: new Date().toISOString(), splitBetween: group.memberIds
    };
    setExpenses(current => [...current, created]);
    return "";
  };

  const addSettlement = (settlement) => {
    const amount = Number(settlement.amount);
    if (!settlement.from || !settlement.to || settlement.from === settlement.to || amount <= 0) return "Enter valid settlement details.";
    setSettlements(current => [...current, { ...settlement, id: crypto.randomUUID(), amount, date: new Date().toISOString(), recordedBy: user.id }]);
    return "";
  };

  const data = { users, groups: visibleGroups, allGroups: groups, expenses: visibleExpenses, allExpenses: expenses, settlements, allSettlements: settlements };
  const actions = { addGroup, addExpense, addSettlement, setGroups, setExpenses };

  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup onSignup={signup} />} />
        <Route path="*" element={<Login onLogin={login} />} />
      </Routes>
    );
  }

  return <AppShell user={user} onLogout={logout} data={data} actions={actions} />;
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}
