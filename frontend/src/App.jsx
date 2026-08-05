import { useState, useEffect } from "react";
import { apiFetch } from "./api/api";
import Sidebar from "./components/Sidebar";
import { Toast, useToast } from "./components/Toast";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import LeadsPage from "./pages/LeadsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import "./styles/global.css";

export default function App() {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });
  const [active, setActive] = useState("dashboard");
  const [analytics, setAnalytics] = useState({ total: 0, new: 0, contacted: 0, converted: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const { toasts, add: toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      const res = await apiFetch("/leads/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch {}
  };

  const fetchRecent = async () => {
    try {
      const res = await apiFetch("/leads?page=1&limit=5");
      const data = await res.json();
      setRecentLeads(data.leads || []);
    } catch {}
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      fetchRecent();
    }
  }, [user, active]);

  const handleLogin = (u) => setUser(u);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={active} setActive={setActive} user={user} onLogout={handleLogout} />

      <main style={{ flex: 1, padding: 32, overflowY: "auto", background: "#0f172a" }}>
        {active === "dashboard" && <DashboardPage analytics={analytics} leads={recentLeads} />}
        {active === "leads"     && <LeadsPage toast={toast} />}
        {active === "analytics" && <AnalyticsPage analytics={analytics} />}
        {active === "settings"  && <SettingsPage user={user} />}
      </main>

      <Toast toasts={toasts} />
    </div>
  );
}
