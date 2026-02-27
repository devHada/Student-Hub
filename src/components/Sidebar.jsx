import { useNavigate, useLocation } from "react-router-dom";
import { logOut } from "../firebase/auth";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: "🏠", path: "/dashboard" },
  { label: "Todos", icon: "✅", path: "/todos" },
  { label: "Notes", icon: "📝", path: "/notes" },
  { label: "AI Assistant", icon: "🤖", path: "/ai" },
  { label: "Focus Timer", icon: "⏱️", path: "/focus" },
  { label: "Group Chat", icon: "👥", path: "/group" },
  { label: "Board", icon: "📌", path: "/board" },
  { label: "Student Toolkit", icon: "🧰", path: "/toolkit" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  async function handleLogout() {
    await logOut();
    navigate("/");
  }

  return (
    <div
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40"
      style={{
        background: "var(--sidebar)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* LOGO */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h1 className="text-xl font-bold" style={{ color: "var(--accent)" }}>
          Student Hub
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--primary)" }}>
          made by invictus
        </p>
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all"
              style={{
                background: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "white" : "var(--accent)",
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* USER + LOGOUT */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "var(--primary)" }}
          >
            {user?.email?.[0].toUpperCase() || "?"}
          </div>
          <p
            className="text-xs truncate w-28"
            style={{ color: "var(--accent)" }}
          >
            {user?.email || "Guest"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs transition-colors hover:opacity-70"
          style={{ color: "var(--primary)" }}
        >
          Exit
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
